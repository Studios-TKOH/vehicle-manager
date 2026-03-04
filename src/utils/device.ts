import { v4 as uuidv4 } from 'uuid';

/**
 * Obtiene el ID único del dispositivo desde el almacenamiento local.
 * Si no existe, genera uno nuevo (UUID) y lo persiste.
 * * Esencial para identificar transacciones en la arquitectura Offline-First.
 */
export const getOrCreateDeviceId = (): string => {
    let currentDeviceId = localStorage.getItem('deviceId');
    if (!currentDeviceId) {
        currentDeviceId = uuidv4();
        localStorage.setItem('deviceId', currentDeviceId);
    }
    return currentDeviceId;
};