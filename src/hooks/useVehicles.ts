import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos los mocks desde sus respectivos archivos modulares
import { vehiclesData } from '../data/mock/vehicles';
import { customersData } from '../data/mock/customers';
import { salesData } from '../data/mock/sales';
import { saleDetailsData } from '../data/mock/saleDetails';
import { productsData } from '../data/mock/products';

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

    // Extraemos clientes para el formulario de Agregar/Editar
    const customersList = customersData.customers;

    // 1. Mapear datos relacionales
    const mappedVehicles = useMemo(() => {
        return vehiclesData.vehicles.filter(v => !v.isDeleted).map(v => {
            const cliente = customersData.customers.find(c => c.id === v.propietarioId);
            const chofer = customersData.customers.find(c => c.id === v.conductorHabitualId);

            const vehSales = salesData.sales
                .filter(s => s.vehicleId === v.id)
                .sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());

            const latestSale = vehSales[0];

            const historialConProductos = vehSales.map(sale => {
                const items = saleDetailsData.saleDetails
                    .filter(si => si.saleId === sale.id)
                    .map(si => {
                        const prod = productsData.products.find(p => p.id === si.productId);
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
        setCurrentPage(1);
    };

    const openModal = (type: ModalType, vehicle?: any) => {
        setSelectedVehicle(vehicle || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedVehicle(null);
    };

    // 5. Redirección al Módulo de Ventas (Agregando directo al carrito y mandando Kilometraje)
    const handleEmitirFactura = (vehicle: any, pastSale?: any) => {
        closeModal();

        let productosParaCart: any[] = [];
        let observacionSugerida = "";

        // Si el usuario hace clic en "Repetir" un servicio específico del historial
        if (pastSale && pastSale.items && pastSale.items.length > 0) {
            pastSale.items.forEach((item: any) => {
                const fullProduct = productsData.products.find(p => p.id === item.productId);
                if (fullProduct) {
                    // Preparamos el producto con la cantidad exacta que llevó antes
                    productosParaCart.push({
                        ...fullProduct,
                        cantidad: item.cantidad,
                        precioUnitario: fullProduct.precioVenta
                    });
                }
            });
            observacionSugerida = `Servicio basado en el historial del ${new Date(pastSale.fechaEmision).toLocaleDateString()}.`;
        } else {
            // Si hace clic en "Nueva venta en blanco"
            observacionSugerida = `Atención al vehículo placa ${vehicle.placa}.`;
        }

        navigate('/sales', {
            state: {
                prefillData: {
                    vehicleId: vehicle.id,
                    customerId: vehicle.propietarioId,
                    choferId: vehicle.conductorHabitualId,
                    placa: vehicle.placa,
                    cartItems: productosParaCart, // Enviamos directo al carrito
                    observacionSugerida,
                    kilometrajeActual: vehicle.kmActual || 0,
                    // Si repite una venta pasada, sugerimos el mismo salto de kilometraje
                    kmProximo: pastSale ? pastSale.proximoCambioKm : 0
                }
            }
        });
    };

    // 6. Funciones de guardado 
    const handleSaveVehicle = (data: any) => {
        console.log("Datos a guardar:", data);
        alert(`Vehículo ${data.placa} guardado correctamente (Simulación)`);
        closeModal();
    };

    const handleDeleteVehicle = (id: string) => {
        console.log("Eliminando vehículo con ID:", id);
        alert("Vehículo eliminado correctamente (Simulación)");
        closeModal();
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
        totalItems: filteredVehicles.length,
        customersList,
        handleSaveVehicle,
        handleDeleteVehicle
    };
};