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
    notes?: string | null;
}

export interface ProductEntity extends SyncMetadata {
    companyId: string;
    code: string;
    name: string;
    category: string;
    description: string | null;
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
    currentMileage?: number | null;
    nextMaintenanceMileage?: number | null;
    notes?: string | null;
}

// Detalles de Venta
export interface SaleDetailEntity extends SyncMetadata {
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

// Productos Habituales del Vehículo
export interface VehicleUsualProductEntity extends SyncMetadata {
    vehicleId: string;
    productId: string;
    notes: string | null; // Ej: "Solo usa aceite sintético de esta marca"
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
    saleDetails!: Table<SaleDetailEntity, string>;
    vehicleUsualProducts!: Table<VehicleUsualProductEntity, string>;
    outboxEvents!: Table<OutboxEventEntity, string>;
    syncState!: Table<SyncStateEntity, number>;

    constructor() {
        super('FleetSUNAT_DB');

        this.version(3).stores({
            customers: 'id, companyId, identityDocNumber, name, deletedAt',
            vehicles: 'id, customerId, conductorHabitualId, licensePlate, deletedAt',
            products: 'id, companyId, code, deletedAt',
            sales: 'id, companyId, branchId, customerId, status, deletedAt',
            saleDetails: 'id, saleId, productId, deletedAt',
            vehicleUsualProducts: 'id, vehicleId, productId, deletedAt',
            outboxEvents: 'id, deviceId, status, createdAt',
            syncState: 'id'
        });
    }
}

export const db = new VehicleManagerDB();