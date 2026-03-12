import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type DocumentSeriesEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';
import { useActiveBranch } from '@hooks/useActiveBranch';

export type SeriesModalType = 'add' | 'edit' | 'delete' | 'warning' | null;

export const useSeriesSettings = () => {
    const { deviceId } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const { activeBranchId } = useActiveBranch();

    const [activeModal, setActiveModal] = useState<SeriesModalType>(null);
    const [selectedSeries, setSelectedSeries] = useState<DocumentSeriesEntity | null>(null);
    const [loading, setLoading] = useState(false);

    const dbData = useLiveQuery(async () => {
        const branches = await db.branches.filter(b => b.deletedAt === null).toArray();

        if (!activeBranchId) return { series: [], branches };

        const series = await db.documentSeries.filter(s =>
            s.deletedAt === null &&
            s.branchId === activeBranchId
        ).toArray();

        return { series, branches };
    }, [activeBranchId]) || { series: [], branches: [] };

    const { series, branches } = dbData;

    const openModal = (type: SeriesModalType, seriesItem?: DocumentSeriesEntity) => {
        if (type === 'add' && branches.length === 0) {
            setActiveModal('warning');
            return;
        }

        setSelectedSeries(seriesItem || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedSeries(null);
    };

    const addSeries = useCallback(async (data: Omit<DocumentSeriesEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            const newSeries: DocumentSeriesEntity = {
                ...data,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1,
            };

            await db.transaction('rw', db.documentSeries, db.outboxEvents, async () => {
                await db.documentSeries.add(newSeries);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'documentSeries', entityId: newSeries.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(newSeries), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error agregando serie:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    const updateSeries = useCallback(async (id: string, data: Partial<DocumentSeriesEntity>) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.documentSeries, db.outboxEvents, async () => {
                const existing = await db.documentSeries.get(id);
                if (!existing) throw new Error("Serie no encontrada");

                const updated: DocumentSeriesEntity = {
                    ...existing,
                    ...data,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.documentSeries.put(updated);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'documentSeries', entityId: updated.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(updated), clientUpdatedAt: now, entityVersion: updated.version, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error actualizando serie:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    const deleteSeries = useCallback(async (id: string) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.documentSeries, db.outboxEvents, async () => {
                const existing = await db.documentSeries.get(id);
                if (!existing) throw new Error("Serie no encontrada");

                const deleted: DocumentSeriesEntity = {
                    ...existing,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.documentSeries.put(deleted);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'documentSeries', entityId: deleted.id,
                    operation: 'DELETE', payloadJson: JSON.stringify(deleted), clientUpdatedAt: now, entityVersion: deleted.version, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error eliminando serie:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    return {
        series,
        branches,
        activeBranchId,
        activeModal,
        selectedSeries,
        loading,
        openModal,
        closeModal,
        addSeries,
        updateSeries,
        deleteSeries
    };
};