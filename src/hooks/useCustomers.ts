import { useState, useMemo } from 'react';
import { db } from '../data/db';

export type ModalType = 'details' | 'add' | 'edit' | 'delete' | null;

export const useCustomers = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    // Estados para la simulación de la API Decolecta
    const [isSearchingApi, setIsSearchingApi] = useState(false);

    // 1. Mapear datos y calcular cuántos vehículos tiene cada cliente
    const mappedCustomers = useMemo(() => {
        return db.customers.map(customer => {
            // Contar cuántos vehículos tiene como propietario y como chofer
            const vehiculosPropios = db.vehicles.filter(v => v.propietarioId === customer.id && !v.isDeleted);
            const vehiculosConducidos = db.vehicles.filter(v => v.conductorHabitualId === customer.id && !v.isDeleted);

            return {
                ...customer,
                vehiculosPropios,
                vehiculosConducidos,
                totalVehiculosRelacionados: vehiculosPropios.length + vehiculosConducidos.length
            };
        });
    }, []);

    // 2. Filtrar
    const filteredCustomers = useMemo(() => {
        return mappedCustomers.filter((c) => {
            const term = searchTerm.toLowerCase();
            return (
                c.numeroDocumento.toLowerCase().includes(term) ||
                c.nombreRazonSocial.toLowerCase().includes(term) ||
                (c.email && c.email.toLowerCase().includes(term))
            );
        });
    }, [mappedCustomers, searchTerm]);

    // 3. Paginación
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCustomers, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // 4. Modales
    const openModal = (type: ModalType, customer?: any) => {
        setSelectedCustomer(customer || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedCustomer(null);
    };

    // 5. Simulación de API Decolecta (Validación RUC/DNI)
    const fetchDecolectaData = async (tipoDoc: string, numeroDoc: string) => {
        if (!numeroDoc) return null;

        setIsSearchingApi(true);

        // Aquí leeríamos el token real en producción: import.meta.env.VITE_DECOLECTA_TOKEN
        console.log(`Buscando en Decolecta API con Token... Tipo: ${tipoDoc}, Doc: ${numeroDoc}`);

        // Simulamos el retraso de una red real (1.5 segundos)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSearchingApi(false);

        // Mock de respuestas de SUNAT/RENIEC vía Decolecta
        if (tipoDoc === 'DNI' && numeroDoc.length === 8) {
            return {
                nombreRazonSocial: "MARIO ALBERTO ROJAS PEREZ",
                direccion: "CALLE LOS PINOS 123, LIMA",
            };
        } else if (tipoDoc === 'RUC' && numeroDoc.length === 11) {
            return {
                nombreRazonSocial: "MINERA LOS ANDES S.A.A.",
                direccion: "AV. PRINCIPAL 456 ZONA INDUSTRIAL, AREQUIPA",
            };
        }

        // Retorna null si no lo encuentra o el formato es inválido
        return null;
    };

    return {
        searchTerm,
        handleSearch,
        currentCustomers,
        currentPage,
        totalPages,
        setCurrentPage,
        itemsPerPage,
        handleItemsPerPageChange,
        activeModal,
        openModal,
        closeModal,
        selectedCustomer,
        totalItems: filteredCustomers.length,
        fetchDecolectaData,
        isSearchingApi
    };
};