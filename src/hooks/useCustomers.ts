import { useState, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type CustomerEntity } from '@data/LocalDB';
import { getDecolectaData } from '@services/decolectaService';
import type { DecolectaNormalizedResponse } from '@/types/decolecta';
import { useAuth } from '@hooks/useAuth';

export type ModalType = 'details' | 'add' | 'edit' | 'delete' | null;

export const useCustomers = () => {
    // Extraemos la información real de la sesión (Redux o Context)
    const { user, deviceId } = useAuth();
    const currentCompanyId = user?.companyId;
    // Fallback seguro: Si no está en Redux, lo intentamos leer de localStorage
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    // 1. Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isSearchingApi, setIsSearchingApi] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Lectura Reactiva desde IndexedDB
    // Obtenemos clientes y vehículos no eliminados
    const dbData = useLiveQuery(async () => {
        const customers = await db.customers.filter(c => c.deletedAt === null).toArray();
        const vehicles = await db.vehicles.filter(v => v.deletedAt === null).toArray();
        return { customers, vehicles };
    }, []) || { customers: [], vehicles: [] };

    // 3. Mapear datos
    const mappedCustomers = useMemo(() => {
        return dbData.customers.map(customer => {
            const vehiculosPropios = dbData.vehicles.filter(v => v.customerId === customer.id);
            const vehiculosConducidos = dbData.vehicles.filter(v => v.conductorHabitualId === customer.id);

            return {
                ...customer,
                vehiculosPropios,
                vehiculosConducidos,
                totalVehiculosRelacionados: vehiculosPropios.length + vehiculosConducidos.length
            };
        });
    }, [dbData]);

    // 4. Filtrar
    const filteredCustomers = useMemo(() => {
        return mappedCustomers.filter((c) => {
            const term = searchTerm.toLowerCase();
            return (
                // Usamos identityDocNumber y name en lugar de numeroDocumento y nombreRazonSocial
                c.identityDocNumber.toLowerCase().includes(term) ||
                c.name.toLowerCase().includes(term) ||
                (c.email && c.email.toLowerCase().includes(term))
            );
        });
    }, [mappedCustomers, searchTerm]);

    // 5. Paginación
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
    const currentCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCustomers, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // 6. Modales
    const openModal = (type: ModalType, customer?: any) => {
        setSelectedCustomer(customer || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedCustomer(null);
    };

    // 7. Integración Real API Decolecta
    const fetchDecolectaData = async (tipoDoc: string, numeroDoc: string): Promise<DecolectaNormalizedResponse | null> => {
        if (!numeroDoc) return null;

        setIsSearchingApi(true);
        try {
            return await getDecolectaData(tipoDoc, numeroDoc);
        } finally {
            setIsSearchingApi(false);
        }
    };

    // 8. Operaciones CRUD (Offline-first con Outbox Pattern)
    const addCustomer = useCallback(async (customerData: Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version' | 'companyId'>) => {
        if (!currentCompanyId || !currentDeviceId) {
            setError('Error de sesión: No se identificó la empresa o el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            const newCustomer: CustomerEntity = {
                ...customerData,
                id: uuidv4(),
                companyId: currentCompanyId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1,
            };

            await db.transaction('rw', db.customers, db.outboxEvents, async () => {
                await db.customers.add(newCustomer);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'customer',
                    entityId: newCustomer.id,
                    operation: 'UPSERT',
                    payloadJson: JSON.stringify(newCustomer),
                    clientUpdatedAt: now,
                    entityVersion: newCustomer.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error adding customer:", err);
            setError(err.message || 'Error al guardar el cliente');
        } finally {
            setLoading(false);
        }
    }, [currentCompanyId, currentDeviceId]);

    const updateCustomer = useCallback(async (id: string, updates: Partial<CustomerEntity>) => {
        if (!currentDeviceId) {
            setError('Error de sesión: No se identificó el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.customers, db.outboxEvents, async () => {
                const existing = await db.customers.get(id);
                if (!existing) throw new Error("Cliente no encontrado");

                const updated: CustomerEntity = {
                    ...existing,
                    ...updates,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.customers.put(updated);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'customer',
                    entityId: updated.id,
                    operation: 'UPSERT',
                    payloadJson: JSON.stringify(updated),
                    clientUpdatedAt: now,
                    entityVersion: updated.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error updating customer:", err);
            setError(err.message || 'Error al actualizar el cliente');
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    const deleteCustomer = useCallback(async (id: string) => {
        if (!currentDeviceId) {
            setError('Error de sesión: No se identificó el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.customers, db.outboxEvents, async () => {
                const existing = await db.customers.get(id);
                if (!existing) throw new Error("Cliente no encontrado");

                const deleted: CustomerEntity = {
                    ...existing,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.customers.put(deleted);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'customer',
                    entityId: deleted.id,
                    operation: 'DELETE',
                    payloadJson: JSON.stringify(deleted),
                    clientUpdatedAt: now,
                    entityVersion: deleted.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error deleting customer:", err);
            setError(err.message || 'Error al eliminar el cliente');
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    return {
        searchTerm,
        handleSearch,
        currentCustomers,
        currentPage,
        totalPages,
        setCurrentPage,
        itemsPerPage,
        handleItemsPerPageChange,
        totalItems: filteredCustomers.length,
        activeModal,
        openModal,
        closeModal,
        selectedCustomer,
        fetchDecolectaData,
        isSearchingApi,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        loading,
        error
    };
};