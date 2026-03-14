import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type UserEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';

export type UserModalType = 'add' | 'edit' | 'delete' | 'warning' | null;

export const useUsersSettings = () => {
    const { user, deviceId, updateSession } = useAuth();
    const currentCompanyId = user?.companyId;
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const [activeModal, setActiveModal] = useState<UserModalType>(null);
    const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
    const [loading, setLoading] = useState(false);

    const dbData = useLiveQuery(async () => {
        const users = await db.users.filter(u => u.deletedAt === null).toArray();
        const branches = await db.branches.filter(b => b.deletedAt === null).toArray();
        return { users, branches };
    }, []) || { users: [], branches: [] };

    const { users, branches } = dbData;

    const openModal = (type: UserModalType, userItem?: UserEntity) => {
        if (type === 'add' && branches.length === 0) {
            setActiveModal('warning');
            return;
        }

        setSelectedUser(userItem || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedUser(null);
    };

    const addUser = useCallback(async (data: Omit<UserEntity, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version'>, temporaryPassword?: string) => {
        if (!currentCompanyId || !currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            const newUser: UserEntity = {
                ...data,
                id: uuidv4(),
                companyId: currentCompanyId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1,
            };

            await db.transaction('rw', db.users, db.outboxEvents, async () => {
                await db.users.add(newUser);

                const payload = {
                    ...newUser,
                    temporaryPassword: temporaryPassword || undefined
                };

                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'user', entityId: newUser.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(payload), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error agregando usuario:", error);
        } finally {
            setLoading(false);
        }
    }, [currentCompanyId, currentDeviceId]);

    const updateUser = useCallback(async (id: string, data: Partial<UserEntity>) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.users, db.outboxEvents, async () => {
                const existing = await db.users.get(id);
                if (!existing) throw new Error("Usuario no encontrado");

                const updated: UserEntity = {
                    ...existing,
                    ...data,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.users.put(updated);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'user', entityId: updated.id,
                    operation: 'UPSERT', payloadJson: JSON.stringify(updated), clientUpdatedAt: now, entityVersion: updated.version, status: 'PENDING', createdAt: now
                });
            });

            if (user && user.id === id && updateSession) {
                // Filtramos solo los datos relevantes para la sesión de Redux
                const sessionUpdates: any = {};
                if (data.nombre !== undefined) sessionUpdates.nombre = data.nombre;
                if (data.email !== undefined) sessionUpdates.email = data.email;
                if (data.rol !== undefined) sessionUpdates.rol = data.rol;
                if (data.branchIds !== undefined) sessionUpdates.branchIds = data.branchIds;

                if (Object.keys(sessionUpdates).length > 0) {
                    updateSession(sessionUpdates);
                }
            }
            
            closeModal();
        } catch (error) {
            console.error("Error actualizando usuario:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    const deleteUser = useCallback(async (id: string) => {
        if (!currentDeviceId) return;
        setLoading(true);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.users, db.outboxEvents, async () => {
                const existing = await db.users.get(id);
                if (!existing) throw new Error("Usuario no encontrado");

                const deleted: UserEntity = {
                    ...existing,
                    activo: false,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.users.put(deleted);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'user', entityId: deleted.id,
                    operation: 'DELETE', payloadJson: JSON.stringify(deleted), clientUpdatedAt: now, entityVersion: deleted.version, status: 'PENDING', createdAt: now
                });
            });
            closeModal();
        } catch (error) {
            console.error("Error eliminando usuario:", error);
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    return {
        users,
        branches,
        activeModal,
        selectedUser,
        loading,
        openModal,
        closeModal,
        addUser,
        updateUser,
        deleteUser
    };
};