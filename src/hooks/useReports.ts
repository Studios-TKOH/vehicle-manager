import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@data/LocalDB'; // Asegúrate de que este path sea el correcto para tu LocalDB.ts

export const useReports = () => {
    const data = useLiveQuery(async () => {
        const allSales = await db.sales.toArray();
        const allDetails = await db.saleDetails.toArray();
        const allProducts = await db.products.toArray();
        const allCustomers = await db.customers.toArray();

        const ventasActivas = allSales.filter(s => s.deletedAt === null);
        const ventasConfirmadas = ventasActivas.filter(s => s.status === 'CONFIRMED');

        const ingresosTotales = ventasConfirmadas.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const ticketPromedio = ventasConfirmadas.length > 0 ? ingresosTotales / ventasConfirmadas.length : 0;
        const clientesUnicos = new Set(ventasConfirmadas.map(s => s.customerId)).size;

        const kpis = {
            totalVentas: ventasConfirmadas.length,
            ingresosTotales,
            ticketPromedio,
            clientesUnicos
        };

        const conteoProductos: Record<string, { cantidad: number, ingresos: number }> = {};
        const idsVentasConfirmadas = new Set(ventasConfirmadas.map(s => s.id));

        allDetails.forEach(detalle => {
            if (idsVentasConfirmadas.has(detalle.saleId) && detalle.deletedAt === null) {
                if (!conteoProductos[detalle.productId]) {
                    conteoProductos[detalle.productId] = { cantidad: 0, ingresos: 0 };
                }
                conteoProductos[detalle.productId].cantidad += detalle.quantity;
                conteoProductos[detalle.productId].ingresos += detalle.lineTotalWithIgv;
            }
        });

        const topProductos = Object.entries(conteoProductos)
            .map(([productId, stats]) => {
                const prod = allProducts.find(p => p.id === productId);
                return {
                    id: productId,
                    nombre: prod?.name || 'Producto No Encontrado',
                    ...stats
                };
            })
            .sort((a, b) => b.ingresos - a. ingresos)
            .slice(0, 5);

        const ventasRecientes = ventasConfirmadas
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
            .slice(0, 5)
            .map(sale => {
                const cliente = allCustomers.find(c => c.id === sale.customerId);
                return {
                    ...sale,
                    clienteNombre: cliente?.name || 'Cliente Desconocido'
                };
            });

        return { kpis, topProductos, ventasRecientes };
    }, []);

    return {
        kpis: data?.kpis || { totalVentas: 0, ingresosTotales: 0, ticketPromedio: 0, clientesUnicos: 0 },
        topProductos: data?.topProductos || [],
        ventasRecientes: data?.ventasRecientes || [],
        isLoading: data === undefined
    };
};