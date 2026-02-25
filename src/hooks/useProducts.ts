import { useState, useMemo } from 'react';
import { db } from '../data/db';

export type ModalType = 'details' | 'add' | 'edit' | 'delete' | null;

export const useProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("TODAS"); // Filtro extra por categoría
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // 1. Obtener lista de categorías únicas para el filtro
    const categories = useMemo(() => {
        const uniqueCategories = new Set(db.products.map(p => p.categoria));
        return ["TODAS", ...Array.from(uniqueCategories)];
    }, []);

    // 2. Filtrado múltiple (Búsqueda de texto + Categoría)
    const filteredProducts = useMemo(() => {
        return db.products.filter((p) => {
            // Filtro por categoría
            const matchCategory = selectedCategory === "TODAS" || p.categoria === selectedCategory;

            // Filtro por texto
            const term = searchTerm.toLowerCase();
            const matchSearch =
                p.nombre.toLowerCase().includes(term) ||
                p.codigoBarras.toLowerCase().includes(term) ||
                p.categoria.toLowerCase().includes(term);

            return matchCategory && matchSearch;
        });
    }, [searchTerm, selectedCategory]);

    // 3. Paginación
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // 4. Modales
    const openModal = (type: ModalType, product?: any) => {
        setSelectedProduct(product || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedProduct(null);
    };

    return {
        searchTerm,
        handleSearch,
        categories,
        selectedCategory,
        handleCategoryChange,
        currentProducts,
        currentPage,
        totalPages,
        setCurrentPage,
        itemsPerPage,
        handleItemsPerPageChange,
        activeModal,
        openModal,
        closeModal,
        selectedProduct,
        totalItems: filteredProducts.length
    };
};