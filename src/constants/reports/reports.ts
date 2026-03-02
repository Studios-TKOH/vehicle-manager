import type { ReportIconKey } from '../../ui/icons/reportIcons'

export type ReporteDisponible = {
    id: string
    titulo: string
    descripcion: string
    icono: ReportIconKey
}

export const REPORTES_DISPONIBLES: ReporteDisponible[] = [
    {
        id: 'ventas_general',
        titulo: 'Reporte de Ventas General',
        descripcion: 'Listado detallado',
        icono: 'receipt'
    },
    {
        id: 'productos_vendidos',
        titulo: 'Productos Más Vendidos',
        descripcion: '-',
        icono: 'package'
    },
    {
        id: 'historial_vehiculos',
        titulo: 'Historial por Vehículo',
        descripcion: 'Servicios agrupados',
        icono: 'truck'
    },
    {
        id: 'clientes_frecuentes',
        titulo: 'Clientes Frecuentes',
        descripcion: 'Clientes recurrentes',
        icono: 'users'
    }
]