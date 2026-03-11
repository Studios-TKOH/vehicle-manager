import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@data/LocalDB';

export const useSalesHistory = () => {
    // 1. Estados
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 2. Control de Fecha
    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
        setCurrentPage(1); // Resetear página al cambiar de día
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
        setCurrentPage(1);
    };

    // Formatear a "Lunes, 15 de marzo de 2026"
    const formattedDateText = useMemo(() => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const text = selectedDate.toLocaleDateString('es-PE', options);
        return text.charAt(0).toUpperCase() + text.slice(1);
    }, [selectedDate]);

    // 3. Consulta a Dexie (A Prueba de Zonas Horarias)
    const rawSalesData = useLiveQuery(async () => {

        // Extraemos el Año, Mes y Día exactos de la zona horaria del dispositivo (Perú)
        const targetYear = selectedDate.getFullYear();
        const targetMonth = selectedDate.getMonth();
        const targetDate = selectedDate.getDate();

        // Filtramos convirtiendo la fecha guardada (UTC) a la zona local
        const daySales = await db.sales
            .filter(s => {
                if (s.deletedAt !== null) return false;

                // Convertimos el string ISO (Ej: 2026-03-10T04:57:00Z) a fecha local
                const saleDate = new Date(s.issueDate);

                // Comparamos los días en hora local (Perú)
                return saleDate.getFullYear() === targetYear &&
                    saleDate.getMonth() === targetMonth &&
                    saleDate.getDate() === targetDate;
            })
            .toArray();

        // Cruzamos datos manualmente (Join en cliente)
        const populatedSales = await Promise.all(daySales.map(async (sale) => {
            const customer = await db.customers.get(sale.customerId);
            const vehicle = sale.vehicleId ? await db.vehicles.get(sale.vehicleId) : null;

            return {
                ...sale,
                customer,
                vehicle
            };
        }));

        // Ordenar de la más reciente a la más antigua
        return populatedSales.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [selectedDate]);

    // 4. Filtrado de Búsqueda
    const filteredSales = useMemo(() => {
        if (!rawSalesData) return [];
        if (!searchQuery) return rawSalesData;

        const q = searchQuery.toLowerCase();
        return rawSalesData.filter(sale => {
            const docStr = `${sale.series}-${sale.correlativeNumber}`.toLowerCase();
            const clientName = sale.customer?.name.toLowerCase() || '';
            const plate = sale.vehicle?.licensePlate.toLowerCase() || '';

            return docStr.includes(q) || clientName.includes(q) || plate.includes(q);
        });
    }, [rawSalesData, searchQuery]);

    // 5. Paginación
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
    const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    return {
        selectedDate,
        formattedDateText,
        handlePrevDay,
        handleNextDay,
        searchQuery,
        setSearchQuery: (q: string) => { setSearchQuery(q); setCurrentPage(1); },
        sales: paginatedSales,
        currentPage,
        totalPages,
        totalItems: filteredSales.length,
        handleNextPage,
        handlePrevPage,
        isLoading: rawSalesData === undefined
    };
};