import { useMemo } from 'react';
import { db } from '../data/db';

export const useReports = () => {
    const kpis = useMemo(() => {
        const ventasActivas = db.sales.filter(s => !s.isDeleted);

        const ingresosTotales = ventasActivas.reduce((sum, sale) => sum + sale.total, 0);
        const ticketPromedio = ventasActivas.length > 0 ? ingresosTotales / ventasActivas.length : 0;
        const clientesUnicos = new Set(ventasActivas.map(s => s.customerId)).size;

        return {
            totalVentas: ventasActivas.length,
            ingresosTotales,
            ticketPromedio,
            clientesUnicos
        };
    }, []);

    const topProductos = useMemo(() => {
        const ventasActivasIds = db.sales.filter(s => !s.isDeleted).map(s => s.id);
        const detallesValidos = db.saleDetails.filter(sd => ventasActivasIds.includes(sd.saleId));

        const conteoProductos: Record<string, { cantidad: number, ingresos: number }> = {};

        detallesValidos.forEach(detalle => {
            if (!conteoProductos[detalle.productId]) {
                conteoProductos[detalle.productId] = { cantidad: 0, ingresos: 0 };
            }
            conteoProductos[detalle.productId].cantidad += detalle.cantidad;
            conteoProductos[detalle.productId].ingresos += detalle.subtotal;
        });

        return Object.entries(conteoProductos)
            .map(([productId, data]) => {
                const prod = db.products.find(p => p.id === productId);
                return {
                    id: productId,
                    nombre: prod?.nombre || 'Producto Eliminado',
                    ...data
                };
            })
            .sort((a, b) => b.ingresos - a.ingresos)
            .slice(0, 5);
    }, []);

    const ventasRecientes = useMemo(() => {
        return db.sales
            .filter(s => !s.isDeleted)
            .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime())
            .slice(0, 5)
            .map(sale => {
                const cliente = db.customers.find(c => c.id === sale.customerId);
                return {
                    ...sale,
                    clienteNombre: cliente?.nombreRazonSocial || 'Cliente Desconocido'
                };
            });
    }, []);

    return {
        kpis,
        topProductos,
        ventasRecientes
    };
};