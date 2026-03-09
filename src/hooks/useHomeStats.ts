import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@data/LocalDB";

interface HomeStats {
    totalVehicles: number;
    todaySales: number;
    pendingMaintenances: number;
    isLoading: boolean;
}

export const useHomeStats = (): HomeStats => {
    // 1. Escuchamos reactivamente los vehículos y las ventas validadas
    const dbData = useLiveQuery(async () => {
        const vehicles = await db.vehicles.filter(v => v.deletedAt === null).toArray();
        const sales = await db.sales.filter(s => s.deletedAt === null && s.status !== 'VOIDED').toArray();
        return { vehicles, sales };
    }, []);

    // 2. Calculamos las estadísticas
    const stats = useMemo(() => {
        if (!dbData) {
            return {
                totalVehicles: 0,
                todaySales: 0,
                pendingMaintenances: 0,
                isLoading: true,
            };
        }

        const { vehicles, sales } = dbData;

        // A. Total Vehículos Activos
        const totalVehicles = vehicles.length;

        // B. Facturación de Hoy
        const todayStr = new Date().toISOString().split('T')[0]; // Fecha formato YYYY-MM-DD
        const todaySales = sales
            .filter(s => s.issueDate.startsWith(todayStr))
            .reduce((acc, sale) => acc + sale.totalAmount, 0);

        // C. Mantenimientos Pendientes (Alertas a 500km de vencerse)
        let pendingMaintenances = 0;

        vehicles.forEach(vehicle => {
            // Buscamos todas las ventas asociadas al vehículo
            const vehicleSales = sales
                .filter(s => s.vehicleId === vehicle.id)
                .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

            const latestSale = vehicleSales[0]; // Último servicio

            // Evaluamos el kilometraje usando la lógica establecida
            const kmActual = latestSale?.currentMileage || vehicle.mileage || 0;
            const kmProximo = latestSale?.nextMaintenanceMileage || 0;

            if (kmProximo > 0 && kmActual >= (kmProximo - 500)) {
                pendingMaintenances++;
            }
        });

        return {
            totalVehicles,
            todaySales,
            pendingMaintenances,
            isLoading: false,
        };
    }, [dbData]);

    return stats;
};