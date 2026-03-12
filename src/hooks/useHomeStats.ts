import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@data/LocalDB";
import { useActiveBranch } from "@hooks/useActiveBranch";

interface HomeStats {
    totalVehicles: number;
    todaySales: number;
    pendingMaintenances: number;
    isLoading: boolean;
}

export const useHomeStats = (): HomeStats => {
    const { activeBranchId } = useActiveBranch();

    const dbData = useLiveQuery(async () => {
        if (!activeBranchId) return null;

        const vehicles = await db.vehicles.filter(v => v.deletedAt === null).toArray();

        const sales = await db.sales.filter(s =>
            s.deletedAt === null &&
            s.status !== 'VOIDED' &&
            s.branchId === activeBranchId
        ).toArray();

        return { vehicles, sales };
    }, [activeBranchId]);

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

        const totalVehicles = vehicles.length;

        const today = new Date();
        const targetYear = today.getFullYear();
        const targetMonth = today.getMonth();
        const targetDate = today.getDate();

        const todaySales = sales
            .filter(s => {
                const saleDate = new Date(s.issueDate);
                return saleDate.getFullYear() === targetYear &&
                    saleDate.getMonth() === targetMonth &&
                    saleDate.getDate() === targetDate;
            })
            .reduce((acc, sale) => acc + sale.totalAmount, 0);

        let pendingMaintenances = 0;

        vehicles.forEach(vehicle => {
            const vehicleSales = sales
                .filter(s => s.vehicleId === vehicle.id)
                .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

            if (vehicleSales.length === 0) return;

            const latestSale = vehicleSales[0];

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