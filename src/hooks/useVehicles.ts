import { useState, useMemo } from 'react';
import { vehiclesData } from '../data/vehiclesMock';

const ITEMS_PER_PAGE = 3;

export const useVehicles = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const filteredVehicles = useMemo(() => {
        return vehiclesData.filter((v) => {
            const term = searchTerm.toLowerCase();
            return (
                v.placa.toLowerCase().includes(term) ||
                v.clienteEmpresa.razonSocial.toLowerCase().includes(term) ||
                v.marca.toLowerCase().includes(term) ||
                v.modelo.toLowerCase().includes(term)
            );
        });
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);

    const currentVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredVehicles, currentPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const toggleDetails = (id: string) => {
        setExpandedRow(prev => prev === id ? null : id);
    };

    return {
        searchTerm,
        handleSearch,
        currentVehicles,
        currentPage,
        totalPages,
        setCurrentPage,
        expandedRow,
        toggleDetails
    };
};