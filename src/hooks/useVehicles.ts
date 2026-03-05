import {
    useState, useMemo,
    // useCallback 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type VehicleEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';
import type { VehicleFormData } from '@/types/vehicles';

export type ModalType = 'details' | 'add' | 'edit' | 'delete' | 'usualProducts' | null;

export const useVehicles = () => {
    const navigate = useNavigate();

    const { deviceId } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Lectura Reactiva Múltiple con Productos Habituales
    const dbData = useLiveQuery(async () => {
        const vehicles = await db.vehicles.filter(v => v.deletedAt === null).toArray();
        const customers = await db.customers.filter(c => c.deletedAt === null).toArray();
        const products = await db.products.filter(p => p.deletedAt === null).toArray();

        // Filtramos ventas offline a los últimos 60 días
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 60);

        const sales = await db.sales.filter(s => s.deletedAt === null && s.status !== 'VOIDED' && new Date(s.issueDate) >= dateThreshold).toArray();
        const saleIds = sales.map(s => s.id);
        const saleDetails = db.tables.find(t => t.name === 'saleDetails') ? await db.table('saleDetails').filter((sd: any) => sd.deletedAt === null && saleIds.includes(sd.saleId)).toArray() : [];

        // NUEVO: Cargamos los productos habituales
        const usualProducts = db.tables.find(t => t.name === 'vehicleUsualProducts') ? await db.table('vehicleUsualProducts').filter((vp: any) => vp.deletedAt === null).toArray() : [];

        return { vehicles, customers, sales, saleDetails, products, usualProducts };
    }, []) || { vehicles: [], customers: [], sales: [], saleDetails: [], products: [], usualProducts: [] };

    const customersList = dbData.customers;
    const productsList = dbData.products; // Para usar en el futuro selector

    // 2. Mapear datos relacionales
    const mappedVehicles = useMemo(() => {
        const { vehicles, customers, sales, saleDetails, products, usualProducts } = dbData;

        return vehicles.map(v => {
            const cliente = customers.find(c => c.id === v.customerId);
            const chofer = customers.find(c => c.id === v.conductorHabitualId);

            // Armar Ficha Técnica Independiente (Productos Habituales)
            const fichaTecnica = usualProducts
                .filter((up: any) => up.vehicleId === v.id)
                .map((up: any) => {
                    const prod = products.find(p => p.id === up.productId);
                    return {
                        id: up.id,
                        productId: up.productId,
                        productName: prod?.name || 'Producto Desconocido',
                        productCode: prod?.code || 'N/A',
                        notes: up.notes
                    };
                });

            const vehSales = sales
                .filter(s => s.vehicleId === v.id)
                .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

            const latestSale = vehSales[0];

            const historialConProductos = vehSales.map(sale => {
                const items = saleDetails
                    .filter((si: any) => si.saleId === sale.id)
                    .map((si: any) => {
                        const prod = products.find(p => p.id === si.productId);
                        return { ...si, productName: prod?.name || 'Producto no encontrado' };
                    });
                return { ...sale, items };
            });

            return {
                ...v,
                clienteNombre: cliente?.name || 'Desconocido',
                clienteDocumento: cliente?.identityDocNumber || '',
                choferNombre: chofer?.name || 'Mismo que propietario',

                // NOTAS AHORA PERTENECEN AL VEHÍCULO (Independiente de ventas)
                notas: v.notes || "",

                // NUEVO: Ficha Técnica
                productosHabituales: fichaTecnica,

                kmActual: (latestSale as any)?.currentMileage || v.mileage || 0,
                kmProximo: (latestSale as any)?.nextMaintenanceMileage || 0,
                historial: historialConProductos,
            };
        });
    }, [dbData]);

    const filteredVehicles = useMemo(() => {
        return mappedVehicles.filter((v) => {
            const term = searchTerm.toLowerCase();
            return (
                v.licensePlate.toLowerCase().includes(term) ||
                v.clienteNombre.toLowerCase().includes(term) ||
                (v.brand && v.brand.toLowerCase().includes(term)) ||
                (v.model && v.model.toLowerCase().includes(term)) ||
                v.clienteDocumento.includes(term)
            );
        });
    }, [mappedVehicles, searchTerm]);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
    const currentVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredVehicles, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const openModal = (type: ModalType, vehicle?: any) => {
        setSelectedVehicle(vehicle || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedVehicle(null);
    };

    const handleEmitirFactura = (vehicle: any, pastSale?: any, useUsualProducts: boolean = false) => {
        closeModal();

        let productosParaCart: any[] = [];
        let observacionSugerida = "";

        // Si elige repetir un servicio del historial
        if (pastSale && pastSale.items && pastSale.items.length > 0) {
            pastSale.items.forEach((item: any) => {
                const fullProduct = dbData.products.find(p => p.id === item.productId);
                if (fullProduct) {
                    productosParaCart.push({
                        ...fullProduct,
                        cantidad: item.quantity,
                        precioUnitario: fullProduct.price
                    });
                }
            });
            observacionSugerida = `Servicio basado en el historial del ${new Date(pastSale.issueDate).toLocaleDateString()}.`;
        }
        // Si elige Facturar Ficha Técnica (Productos Habituales)
        else if (useUsualProducts && vehicle.productosHabituales && vehicle.productosHabituales.length > 0) {
            vehicle.productosHabituales.forEach((pref: any) => {
                const fullProduct = dbData.products.find(p => p.id === pref.productId);
                if (fullProduct) {
                    productosParaCart.push({
                        ...fullProduct,
                        cantidad: 1, // Por defecto 1
                        precioUnitario: fullProduct.price,
                        notaItem: pref.notes // Pasamos la nota de preferencia al carrito (Ej: "2.5 Galones")
                    });
                }
            });
            observacionSugerida = `Servicio basado en la Ficha Técnica del Vehículo.`;
        }
        // Venta en Blanco
        else {
            observacionSugerida = `Atención al vehículo placa ${vehicle.licensePlate}.`;
        }

        navigate('/sales', {
            state: {
                prefillData: {
                    vehicleId: vehicle.id,
                    customerId: vehicle.customerId,
                    choferId: vehicle.conductorHabitualId,
                    placa: vehicle.licensePlate,
                    cartItems: productosParaCart,
                    observacionSugerida,
                    kilometrajeActual: vehicle.kmActual || 0,
                    kmProximo: pastSale ? pastSale.nextMaintenanceMileage : 0
                }
            }
        });
    };

    const handleSaveVehicle = async (data: VehicleFormData) => {
        if (!currentDeviceId) return;

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();

            // Incluimos las notas generales del vehículo en el guardado sin usar 'any'
            const vehicleToSave: Omit<VehicleEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'> = {
                customerId: data.customerId,
                conductorHabitualId: data.conductorHabitualId || undefined,
                licensePlate: data.licensePlate,
                brand: data.brand || null,
                model: data.model || null,
                year: data.year === '' ? null : Number(data.year),
                mileage: data.mileage === '' ? null : Number(data.mileage),
                notes: data.notes || null // <-- AHORA ES TOTALMENTE TYPE-SAFE
            };

            if (activeModal === 'add') {
                const newVehicle: VehicleEntity = {
                    ...vehicleToSave,
                    id: uuidv4(),
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: null,
                    version: 1,
                };

                await db.transaction('rw', db.vehicles, db.outboxEvents, async () => {
                    await db.vehicles.add(newVehicle);
                    await db.outboxEvents.add({
                        id: uuidv4(),
                        deviceId: currentDeviceId,
                        entityType: 'vehicle',
                        entityId: newVehicle.id,
                        operation: 'UPSERT',
                        payloadJson: JSON.stringify(newVehicle),
                        clientUpdatedAt: now,
                        entityVersion: newVehicle.version,
                        status: 'PENDING',
                        createdAt: now,
                    });
                });
            } else if (activeModal === 'edit' && selectedVehicle) {
                await db.transaction('rw', db.vehicles, db.outboxEvents, async () => {
                    const existing = await db.vehicles.get(selectedVehicle.id);
                    if (!existing) throw new Error("Vehículo no encontrado");

                    const updated: VehicleEntity = {
                        ...existing,
                        ...vehicleToSave,
                        updatedAt: now,
                        version: existing.version + 1,
                    };

                    await db.vehicles.put(updated);
                    await db.outboxEvents.add({
                        id: uuidv4(),
                        deviceId: currentDeviceId,
                        entityType: 'vehicle',
                        entityId: updated.id,
                        operation: 'UPSERT',
                        payloadJson: JSON.stringify(updated),
                        clientUpdatedAt: now,
                        entityVersion: updated.version,
                        status: 'PENDING',
                        createdAt: now,
                    });
                });
            }
            closeModal();
        } catch (err: any) {
            console.error("Error saving vehicle:", err);
            setError(err.message || 'Error al guardar el vehículo');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.vehicles, db.outboxEvents, async () => {
                const existing = await db.vehicles.get(id);
                if (!existing) return;

                const deleted: VehicleEntity = {
                    ...existing,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.vehicles.put(deleted);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'vehicle',
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
        } catch (err) {
            console.error("Error deleting vehicle:", err);
        } finally {
            setLoading(false);
        }
    };


    // 7. GESTIÓN DE FICHA TÉCNICA (Productos Habituales)
    const saveUsualProducts = async (vehicleId: string, items: { productId: string, notes: string }[]) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.vehicleUsualProducts, db.outboxEvents, async () => {
                // Obtener los actuales no eliminados para este vehículo
                const existing = await db.vehicleUsualProducts
                    .filter((vp: any) => vp.vehicleId === vehicleId && vp.deletedAt === null)
                    .toArray();

                const existingMap = new Map(existing.map((e: any) => [e.productId, e]));
                const newMap = new Map(items.map(i => [i.productId, i]));

                // 1. Eliminar los que ya no están en la lista (Soft Delete)
                for (const ex of existing) {
                    if (!newMap.has(ex.productId)) {
                        const deleted: any = { ...ex, deletedAt: now, updatedAt: now, version: ex.version + 1 };
                        await db.vehicleUsualProducts.put(deleted);
                        await db.outboxEvents.add({
                            id: uuidv4(), deviceId: currentDeviceId, entityType: 'vehicleUsualProduct', entityId: deleted.id,
                            operation: 'DELETE', payloadJson: JSON.stringify(deleted), clientUpdatedAt: now, entityVersion: deleted.version, status: 'PENDING', createdAt: now
                        });
                    }
                }

                // 2. Insertar nuevos o actualizar notas si cambiaron
                for (const item of items) {
                    const ex = existingMap.get(item.productId);
                    if (ex) {
                        if (ex.notes !== item.notes) {
                            const updated: any = { ...ex, notes: item.notes || null, updatedAt: now, version: ex.version + 1 };
                            await db.vehicleUsualProducts.put(updated);
                            await db.outboxEvents.add({
                                id: uuidv4(), deviceId: currentDeviceId, entityType: 'vehicleUsualProduct', entityId: updated.id,
                                operation: 'UPSERT', payloadJson: JSON.stringify(updated), clientUpdatedAt: now, entityVersion: updated.version, status: 'PENDING', createdAt: now
                            });
                        }
                    } else {
                        const newVup: any = {
                            id: uuidv4(), vehicleId, productId: item.productId, notes: item.notes || null,
                            createdAt: now, updatedAt: now, deletedAt: null, version: 1
                        };
                        await db.vehicleUsualProducts.add(newVup);
                        await db.outboxEvents.add({
                            id: uuidv4(), deviceId: currentDeviceId, entityType: 'vehicleUsualProduct', entityId: newVup.id,
                            operation: 'UPSERT', payloadJson: JSON.stringify(newVup), clientUpdatedAt: now, entityVersion: newVup.version, status: 'PENDING', createdAt: now
                        });
                    }
                }
            });
            closeModal();
        } catch (err) {
            console.error("Error saving usual products:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        searchTerm,
        handleSearch,
        currentVehicles,
        currentPage,
        totalPages,
        setCurrentPage,
        itemsPerPage,
        handleItemsPerPageChange,
        activeModal,
        openModal,
        closeModal,
        selectedVehicle,
        handleEmitirFactura,
        totalItems: filteredVehicles.length,
        customersList,
        productsList, // Exportamos la lista de productos para el buscador
        handleSaveVehicle,
        handleDeleteVehicle,
        saveUsualProducts, // Exportamos la nueva función
        loading,
        error
    };
};