import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../data/db';

export type ModalType = 'details' | 'add' | 'edit' | 'delete' | null;

export const useVehicles = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Paginación dinámica
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Estado de los Modales
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    // 1. Mapear datos relacionales (Unir Vehículos con Clientes y Ventas)
    const mappedVehicles = useMemo(() => {
        return db.vehicles.filter(v => !v.isDeleted).map(v => {
            // Usamos tus campos exactos del JSON
            const cliente = db.customers.find(c => c.id === v.propietarioId);
            const chofer = db.customers.find(c => c.id === v.conductorHabitualId);

            // Buscar el historial de servicios (Ventas asociadas a este vehículo)
            const vehSales = db.sales
                .filter(s => s.vehicleId === v.id)
                .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());

            const latestSale = vehSales[0]; // El servicio más reciente

            // Adjuntar productos a cada venta
            const historialConProductos = vehSales.map(sale => {
                const items = db.saleDetails
                    .filter(si => si.saleId === sale.id)
                    .map(si => {
                        const prod = db.products.find(p => p.id === si.productId);
                        return { ...si, productName: prod?.nombre || 'Producto no encontrado' };
                    });
                return { ...sale, items };
            });

            return {
                ...v,
                clienteNombre: cliente?.nombreRazonSocial || 'Desconocido',
                clienteDocumento: cliente?.numeroDocumento || '',
                choferNombre: chofer?.nombreRazonSocial || 'Sin chofer',
                notas: (v as any).notas || "Sin Observaciones",
                // REGLA DE ORO: Si hay venta, muestra el km de la venta, sino, el km base de registro.
                kmActual: latestSale?.kilometrajeIngreso || v.kilometrajeActual || 0,
                kmProximo: latestSale?.proximoCambioKm || 0,
                historial: historialConProductos,
            };
        });
    }, []);

    // 2. Filtrar
    const filteredVehicles = useMemo(() => {
        return mappedVehicles.filter((v) => {
            const term = searchTerm.toLowerCase();
            return (
                v.placa.toLowerCase().includes(term) ||
                v.clienteNombre.toLowerCase().includes(term) ||
                v.marca.toLowerCase().includes(term) ||
                v.modelo.toLowerCase().includes(term)
            );
        });
    }, [mappedVehicles, searchTerm]);

    // 3. Paginación
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const currentVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredVehicles, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Volver a la primera página si cambiamos la cantidad
    };

    // 4. Manejo de Modales
    const openModal = (type: ModalType, vehicle?: any) => {
        setSelectedVehicle(vehicle || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedVehicle(null);
    };

    // 5. Redirección al Módulo de Ventas
    const handleEmitirFactura = (vehicle: any) => {
        closeModal();
        // Navegamos a la ruta de ventas pasándole los IDs pre-cargados
        navigate('/sales', {
            state: {
                prefillData: {
                    vehicleId: vehicle.id,
                    customerId: vehicle.propietarioId,
                    choferId: vehicle.conductorHabitualId,
                    placa: vehicle.placa,
                }
            }
        });
    };

    return {
        searchTerm,
        handleSearch,
        currentVehicles,
        currentPage,
        totalPages,
        setCurrentPage,
        itemsPerPage,
        handleItemsPerPageChange,
        activeModal,
        openModal,
        closeModal,
        selectedVehicle,
        handleEmitirFactura,
        totalItems: filteredVehicles.length
    };
};