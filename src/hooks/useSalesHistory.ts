import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@data/LocalDB';
import type { SaleSuccessData } from '@components/sales/SaleSuccessModal';
import { useActiveBranch } from '@hooks/useActiveBranch';

export const useSalesHistory = () => {
    const { activeBranchId } = useActiveBranch();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedSale, setSelectedSale] = useState<SaleSuccessData | null>(null);

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
        setCurrentPage(1);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
        setCurrentPage(1);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateVal = e.target.value;
        if (!dateVal) return;
        const [year, month, day] = dateVal.split('-').map(Number);
        const newDate = new Date(year, month - 1, day);
        setSelectedDate(newDate);
        setCurrentPage(1);
    };

    const formattedDateText = useMemo(() => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const text = selectedDate.toLocaleDateString('es-PE', options);
        return text.charAt(0).toUpperCase() + text.slice(1);
    }, [selectedDate]);

    const selectedDateString = useMemo(() => {
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [selectedDate]);


    const rawSalesData = useLiveQuery(async () => {
        if (!activeBranchId) return [];

        const targetYear = selectedDate.getFullYear();
        const targetMonth = selectedDate.getMonth();
        const targetDate = selectedDate.getDate();

        const daySales = await db.sales
            .filter(s => {
                if (s.branchId !== activeBranchId) return false;

                if (s.deletedAt !== null) return false;

                const saleDate = new Date(s.issueDate);
                return saleDate.getFullYear() === targetYear &&
                    saleDate.getMonth() === targetMonth &&
                    saleDate.getDate() === targetDate;
            })
            .toArray();

        const populatedSales = await Promise.all(daySales.map(async (sale) => {
            const customer = await db.customers.get(sale.customerId);
            const vehicle = sale.vehicleId ? await db.vehicles.get(sale.vehicleId) : null;
            return { ...sale, customer, vehicle };
        }));

        return populatedSales.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [selectedDate, activeBranchId]);

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

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
    const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

    const handleOpenDetails = (sale: any) => {
        setSelectedSale({
            docType: sale.docType,
            series: sale.series,
            correlativeNumber: sale.correlativeNumber,
            customerName: sale.customer?.name || 'Público en General',
            customerDocument: sale.customer?.identityDocNumber || 'S/N',
            totalAmount: sale.totalAmount,
            issueDate: sale.issueDate,
            sunatStatus: sale.sunatStatus
        });
    };
    const handleCloseDetails = () => setSelectedSale(null);

    return {
        selectedDateString,
        handleDateChange,
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
        isLoading: rawSalesData === undefined,
        selectedSale,
        handleOpenDetails,
        handleCloseDetails
    };
};