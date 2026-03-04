import Dexie, { type Table } from 'dexie';

// --- Interfaces Base ---
export interface SyncMetadata {
    id: string; // UUID CHAR(36)
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    version: number;
}

export interface CustomerEntity extends SyncMetadata {
    companyId: string;
    identityDocType: string; // Ej: '1' para DNI, '6' para RUC
    identityDocNumber: string;
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    isActive: boolean;
}

export interface VehicleEntity extends SyncMetadata {
    customerId: string; // El Propietario
    conductorHabitualId?: string;
    licensePlate: string;
    brand: string | null;
    model: string | null;
    year: number | null;
    mileage: number | null;
}

export interface ProductEntity extends SyncMetadata {
    companyId: string;
    code: string;
    name: string;
    unitType: string;
    price: number;
    isActive: boolean;
}

export interface SaleEntity extends SyncMetadata {
    companyId: string;
    branchId: string;
    customerId: string;
    vehicleId: string | null;
    issueDate: string;
    totalAmount: number;
    status: 'DRAFT' | 'CONFIRMED' | 'VOIDED';
}

// --- Tablas de Sincronización (Outbox) ---
export type SyncOperation = 'UPSERT' | 'DELETE';

export interface OutboxEventEntity {
    id: string;
    deviceId: string;
    entityType: string;
    entityId: string;
    operation: SyncOperation;
    payloadJson: string;
    clientUpdatedAt: string;
    entityVersion: number;
    status: 'PENDING' | 'IN_FLIGHT' | 'FAILED';
    createdAt: string;
}

export interface SyncStateEntity {
    id: number;
    deviceId: string;
    lastPullToken: string | null;
    lastSuccessSyncAt: string | null;
}

// --- Configuración Dexie ---
export class VehicleManagerDB extends Dexie {
    customers!: Table<CustomerEntity, string>;
    vehicles!: Table<VehicleEntity, string>;
    products!: Table<ProductEntity, string>;
    sales!: Table<SaleEntity, string>;
    outboxEvents!: Table<OutboxEventEntity, string>;
    syncState!: Table<SyncStateEntity, number>;

    constructor() {
        super('FleetSUNAT_DB');

        // Definimos los índices de búsqueda. El primero es la PK.
        this.version(1).stores({
            customers: 'id, companyId, identityDocNumber, name, deletedAt',
            vehicles: 'id, customerId, conductorHabitualId, licensePlate, deletedAt',
            products: 'id, companyId, code, deletedAt',
            sales: 'id, companyId, branchId, customerId, status, deletedAt',
            outboxEvents: 'id, deviceId, status, createdAt',
            syncState: 'id'
        });
    }
}

export const db = new VehicleManagerDB();