export const db = {
    company: {
        id: "comp-1234-abcd",
        ruc: "20555555551",
        razonSocial: "LUBRICENTROS EL MOTORS S.A.C.",
        nombreComercial: "El Motors Lubs",
        direccionFiscal: "Av. Los Mecánicos 123, Lima",
        logoUrl: "/assets/logo-empresa.png",
        datosBancarios: "BCP Soles: 191-1234567-0-12 | CCI: 0021911234567012",
        mensajeDespedidaPie: "¡Gracias por confiar el cuidado de su vehículo en nosotros!",
        monedaPorDefecto: "PEN"
    },
    branches: [
        {
            id: "branch-001",
            companyId: "comp-1234-abcd",
            codigoBase: "SUC01",
            nombre: "Sede Central (Surquillo)",
            direccion: "Av. Angamos 456",
            telefono: "01-555-0001"
        }
    ],
    customers: [
        {
            id: "cust-001",
            tipoDocumentoIdentidad: "RUC",
            numeroDocumento: "20987654321",
            nombreRazonSocial: "TRANSPORTES RAPIDOS S.A.C.",
            direccion: "Calle Los Camiones 123",
            telefono: "987654321",
            email: "logistica@transrapidos.com"
        },
        {
            id: "cust-002",
            tipoDocumentoIdentidad: "DNI",
            numeroDocumento: "76543210",
            nombreRazonSocial: "Juan Perez (Chofer)",
            direccion: "Av. Su Casa 456",
            telefono: "999888777",
            email: "juanperez@gmail.com"
        }
    ],
    vehicles: [
        {
            id: "veh-001",
            propietarioId: "cust-001",
            conductorHabitualId: "cust-002",
            placa: "ABC-123",
            marca: "Toyota",
            modelo: "Hilux",
            anio: 2020,
            color: "Blanco",
            kilometrajeActual: 45000,
            createdAt: "2023-10-25T10:00:00Z",
            syncedAt: "2023-10-25T10:01:00Z",
            isDeleted: false,
            notas: "Usar siempre Magnatec por orden del dueño."
        }
    ],
    products: [
        {
            id: "prod-001",
            codigoBarras: "7751234567801",
            nombre: "Aceite Castrol Magnatec 10W-40 (Galón)",
            categoria: "Aceites de Motor",
            precioVenta: 120.00,
            unidadMedida: "GAL",
            frecuenciaCambioKm: 5000,
            afectacionIgv: "10"
        },
        {
            id: "prod-002",
            codigoBarras: "7751234567802",
            nombre: "Filtro de Aceite Bosh TOY-01",
            categoria: "Filtros",
            precioVenta: 25.00,
            unidadMedida: "NIU",
            frecuenciaCambioKm: 5000,
            afectacionIgv: "10"
        }
    ],
    sales: [
        {
            id: "sale-001",
            branchId: "branch-001",
            userId: "user-001",
            customerId: "cust-001",
            vehicleId: "veh-001",
            choferId: "cust-002",
            tipoComprobante: "FACTURA",
            serie: "F001",
            correlativo: "000151",
            fechaEmision: "2023-10-26T14:30:00Z",
            moneda: "PEN",
            subtotal: 122.88,
            igv: 22.12,
            total: 145.00,
            kilometrajeIngreso: 45000,
            proximoCambioKm: 50000,
            estadoSunat: "ACEPTADO",
            isDeleted: false
        }
    ],
    saleItems: [
        {
            id: "sd-001",
            saleId: "sale-001",
            productId: "prod-001",
            cantidad: 1,
            precioUnitario: 120.00,
            subtotal: 120.00
        },
        {
            id: "sd-002",
            saleId: "sale-001",
            productId: "prod-002",
            cantidad: 1,
            precioUnitario: 25.00,
            subtotal: 25.00
        }
    ]
};