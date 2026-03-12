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
        const today = new Date();
        const targetYear = today.getFullYear();
        const targetMonth = today.getMonth();
        const targetDate = today.getDate();

        const todaySales = sales
            .filter(s => {
                // Convertimos el string ISO (UTC) guardado en la BD a la zona horaria local (Perú)
                const saleDate = new Date(s.issueDate);

                // Comparamos usando los métodos locales, NO los UTC
                return saleDate.getFullYear() === targetYear &&
                    saleDate.getMonth() === targetMonth &&
                    saleDate.getDate() === targetDate;
            })
            .reduce((acc, sale) => acc + sale.totalAmount, 0);

        // C. Mantenimientos Pendientes
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