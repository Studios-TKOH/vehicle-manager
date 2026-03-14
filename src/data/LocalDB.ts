import Dexie, { type Table } from 'dexie';

// --- Interfaces Base ---
export interface SyncMetadata {
    id: string; // UUID CHAR(36)
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    version: number;
}

// --- Entidades de Configuración ---
export interface CompanyEntity extends SyncMetadata {
    ruc: string;
    razonSocial: string;
    nombreComercial: string;
    direccionFiscal: string;
    ubigeo: string | null;
    datosBancarios: string | null;
    mensajeDespedidaPie: string | null;
    monedaPorDefecto: string;
}

export interface BranchEntity extends SyncMetadata {
    companyId: string;
    codigoBase: string;
    nombre: string;
    direccion: string;
    telefono: string | null;
    sunatCodigoSucursal: string | null;
}

export interface UserEntity extends SyncMetadata {
    companyId: string;
    defaultBranchId: string;
    branchIds?: string[];
    nombre: string;
    email: string;
    rol: string; // 'ADMIN' | 'VENDEDOR'
    activo: boolean;
}

// --- Entidades Operativas ---
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
    docType: string; // '01', '03', 'PR'
    series: string;
    correlativeNumber: number;
    issueDate: string;
    currency: string;
    subtotalAmount: number;
    igvAmount: number;
    totalAmount: number;
    currentMileage?: number | null;
    nextMaintenanceMileage?: number | null;
    notes?: string | null;
    status: 'DRAFT' | 'CONFIRMED' | 'VOIDED';
    sunatStatus: 'NOT_SENT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'VOIDED';
}

export interface SaleDetailEntity extends SyncMetadata {
    saleId: string;
    productId: string;
    descriptionSnapshot: string;
    quantity: number;
    unitValueNoIgv: number;
    unitPriceWithIgv: number;
    lineSubtotalNoIgv: number;
    lineIgv: number;
    lineTotalWithIgv: number;
}

// Productos Habituales del Vehículo
export interface VehicleUsualProductEntity extends SyncMetadata {
    vehicleId: string;
    productId: string;
    notes: string | null;
    quantity: number;
    price: number;
    productNameOverride: string | null;
}

export interface DocumentSeriesEntity extends SyncMetadata {
    branchId: string;
    docType: string; // '01', '03', 'PR'
    series: string;
    nextCorrelative: number;
    active: boolean;
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
    company!: Table<CompanyEntity, string>;
    branches!: Table<BranchEntity, string>;
    users!: Table<UserEntity, string>;
    documentSeries!: Table<DocumentSeriesEntity, string>;
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

        // VERSIÓN 5: Añadimos Company, Branches y Users
        this.version(5).stores({
            company: 'id, ruc',
            branches: 'id, companyId, codigoBase, deletedAt',
            users: 'id, companyId, email, deletedAt',
            documentSeries: 'id, branchId, docType, series, deletedAt',
            customers: 'id, companyId, identityDocNumber, name, deletedAt',
            vehicles: 'id, customerId, conductorHabitualId, licensePlate, deletedAt',
            products: 'id, companyId, code, deletedAt',
            sales: 'id, companyId, branchId, customerId, vehicleId, docType, status, deletedAt',
            saleDetails: 'id, saleId, productId, deletedAt',
            vehicleUsualProducts: 'id, vehicleId, productId, deletedAt',
            outboxEvents: 'id, deviceId, status, createdAt',
            syncState: 'id'
        });
    }
}

export const db = new VehicleManagerDB();