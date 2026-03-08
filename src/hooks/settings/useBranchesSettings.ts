import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type BranchEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';

export type BranchModalType = 'add' | 'edit' | 'delete' | null;

export const useBranchesSettings = () => {
    const { user, deviceId } = useAuth();
    const currentCompanyId = user?.companyId;
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const [activeModal, setActiveModal] = useState<BranchModalType>(null);
    const [selectedBranch, setSelectedBranch] = useState<BranchEntity | null>(null);
    const [loading, setLoading] = useState(false);

    // Consulta en tiempo real de sucursales activas
    const branches = useLiveQuery(
        () => db.branches.filter(b => b.deletedAt === null).toArray(),
        []
    ) || [];

    const openModal = (type: BranchModalType, branch?: BranchEntity) => {
        setSelectedBranch(branch || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedBranch(null);
    };

    // Crear Sucursal
    const addBranch = useCallback(async (data: Omit<BranchEntity, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>) => {
        if (!currentCompanyId || !currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            const newBranch: BranchEntity = {
                ...data,
                id: uuidv4(),
                companyId: currentCompanyId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1,
            };

            await db.transaction('rw', db.branches, db.outboxEvents, async () => {
                await db.branches.add(newBranch);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'branch', entityId: newBranch.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(newBranch), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error agregando sucursal:", error);
        } finally {
            setLoading(false);
        }
    }, [currentCompanyId, currentDeviceId]);

    // Actualizar Sucursal
    const updateBranch = useCallback(async (id: string, data: Partial<BranchEntity>) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.branches, db.outboxEvents, async () => {
                const existing = await db.branches.get(id);
                if (!existing) throw new Error("Sucursal no encontrada");

                const updated: BranchEntity = {
                    ...existing,
                    ...data,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.branches.put(updated);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'branch', entityId: updated.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(updated), clientUpdatedAt: now, entityVersion: updated.version, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error actualizando sucursal:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    // Eliminar Sucursal (Soft Delete)
    const deleteBranch = useCallback(async (id: string) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.branches, db.outboxEvents, async () => {
                const existing = await db.branches.get(id);
                if (!existing) throw new Error("Sucursal no encontrada");

                const deleted: BranchEntity = {
                    ...existing,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.branches.put(deleted);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'branch', entityId: deleted.id,
                    operation: 'DELETE', payloadJson: JSON.stringify(deleted), clientUpdatedAt: now, entityVersion: deleted.version, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error eliminando sucursal:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    return {
        branches,
        activeModal,
        selectedBranch,
        loading,
        openModal,
        closeModal,
        addBranch,
        updateBranch,
        deleteBranch
    };
};