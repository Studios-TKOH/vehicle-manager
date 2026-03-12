import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@data/LocalDB';

export const useReports = () => {
    const data = useLiveQuery(async () => {
        const allSales = await db.sales.toArray();
        const allDetails = await db.saleDetails.toArray();
        const allProducts = await db.products.toArray();
        const allCustomers = await db.customers.toArray();
        const allVehicles = await db.vehicles.toArray();

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
            .sort((a, b) => b.ingresos - a.ingresos)
            .slice(0, 5);

        const historialVentas = ventasConfirmadas
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
            .map(sale => {
                const cliente = allCustomers.find(c => c.id === sale.customerId);
                const vehiculo = allVehicles.find(v => v.id === sale.vehicleId);

                return {
                    ...sale,
                    clienteNombre: cliente?.name || 'Cliente Desconocido',
                    vehiclePlate: vehiculo?.licensePlate || null
                };
            });

        const ventasRecientes = historialVentas.slice(0, 5);

        return { kpis, topProductos, ventasRecientes, historialVentas };
    }, []);

    return {
        kpis: data?.kpis || { totalVentas: 0, ingresosTotales: 0, ticketPromedio: 0, clientesUnicos: 0 },
        topProductos: data?.topProductos || [],
        ventasRecientes: data?.ventasRecientes || [],
        historialVentas: data?.historialVentas || [],
        isLoading: data === undefined
    };
};