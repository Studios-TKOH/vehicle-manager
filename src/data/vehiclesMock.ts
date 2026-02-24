export const vehiclesData = [
    {
        id: "VEH-001",
        placa: "ABC-123",
        marca: "Toyota",
        modelo: "Hilux 4x4",
        anio: 2022,
        estado: "ACTIVO",
        kilometrajeActual: 45000,
        proximoMantenimiento: 50000,
        chofer: {
            nombre: "Juan Pérez",
            dni: "12345678",
            licencia: "Q12345678"
        },
        clienteEmpresa: {
            razonSocial: "Logística Minera SAC",
            ruc: "20123456789"
        },
        historialServicios: [
            {
                fecha: "2023-10-15",
                tipo: "Mantenimiento Preventivo",
                costoTotal: 850.50,
                productos: ["Filtro de Aceite", "Aceite Sintético 5W-30", "Filtro de Aire"]
            }
        ]
    },
    {
        id: "VEH-002",
        placa: "XYZ-789",
        marca: "Ford",
        modelo: "Ranger",
        anio: 2021,
        estado: "MANTENIMIENTO",
        kilometrajeActual: 82000,
        proximoMantenimiento: 82000,
        chofer: {
            nombre: "Carlos Gómez",
            dni: "87654321",
            licencia: "Q87654321"
        },
        clienteEmpresa: {
            razonSocial: "Constructora El Sol SRL",
            ruc: "20987654321"
        },
        historialServicios: [
            {
                fecha: "2023-11-02",
                tipo: "Cambio de Pastillas de Freno",
                costoTotal: 420.00,
                productos: ["Pastillas Delanteras", "Líquido de Frenos"]
            },
            {
                fecha: "2023-05-20",
                tipo: "Mantenimiento Correctivo",
                costoTotal: 1200.00,
                productos: ["Amortiguadores Traseros"]
            }
        ]
    },
    {
        id: "VEH-003",
        placa: "DEF-456",
        marca: "Nissan",
        modelo: "Frontier",
        anio: 2023,
        estado: "ACTIVO",
        kilometrajeActual: 15000,
        proximoMantenimiento: 20000,
        chofer: {
            nombre: "Luis Ramírez",
            dni: "45678912",
            licencia: "Q45678912"
        },
        clienteEmpresa: {
            razonSocial: "Agroindustrial Norte",
            ruc: "20456789123"
        },
        historialServicios: []
    },
    {
        id: "VEH-004",
        placa: "GHI-789",
        marca: "Mitsubishi",
        modelo: "L200",
        anio: 2020,
        estado: "INACTIVO",
        kilometrajeActual: 120000,
        proximoMantenimiento: 125000,
        chofer: { nombre: "Ana Torres", dni: "78912345", licencia: "Q78912345" },
        clienteEmpresa: { razonSocial: "Logística Minera SAC", ruc: "20123456789" },
        historialServicios: []
    },
    {
        id: "VEH-005",
        placa: "JKL-012",
        marca: "Toyota",
        modelo: "Tacoma",
        anio: 2024,
        estado: "ACTIVO",
        kilometrajeActual: 5000,
        proximoMantenimiento: 10000,
        chofer: { nombre: "Pedro Silva", dni: "32165498", licencia: "Q32165498" },
        clienteEmpresa: { razonSocial: "Constructora El Sol SRL", ruc: "20987654321" },
        historialServicios: []
    }
];