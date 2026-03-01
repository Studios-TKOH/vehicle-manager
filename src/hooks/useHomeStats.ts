import { useState, useEffect } from "react";
import { salesData } from "../data/mock/sales";
import { vehiclesData } from "../data/mock/vehicles";

interface HomeStats {
    totalVehicles: number;
    todaySales: number;
    pendingMaintenances: number;
    isLoading: boolean;
}

export const useHomeStats = () => {
    const [stats, setStats] = useState<HomeStats>({
        totalVehicles: 0,
        todaySales: 0,
        pendingMaintenances: 0,
        isLoading: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalVehicles = vehiclesData.vehicles.length;

                const todaySales = salesData.sales.reduce((acumulador, sale) => {
                    return acumulador + sale.total;
                }, 0);

                let calculoPendientes = 0;

                vehiclesData.vehicles.forEach(vehicle => {
                    const ultimasVentas = salesData.sales
                        .filter(sale => sale.vehicleId === vehicle.id)
                        .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());

                    const ultimaVenta = ultimasVentas[0]; // Tomamos el último servicio realizado

                    if (ultimaVenta && ultimaVenta.proximoCambioKm) {
                        if (vehicle.kilometrajeActual >= (ultimaVenta.proximoCambioKm - 500)) {
                            calculoPendientes++;
                        }
                    }
                });

                const pendingMaintenances = calculoPendientes;

                setStats({
                    totalVehicles,
                    todaySales,
                    pendingMaintenances,
                    isLoading: false,
                });
            } catch (error) {
                console.error("Error al cargar las estadísticas:", error);
                setStats((prev) => ({ ...prev, isLoading: false }));
            }
        };

        setTimeout(fetchData, 500);
    }, []);

    return stats;
};