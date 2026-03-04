import { useState, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type ProductEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';

export type ProductModalType = 'details' | 'add' | 'edit' | 'delete' | null;

export const useProducts = () => {
    // Sesión
    const { user, deviceId } = useAuth();
    const currentCompanyId = user?.companyId;
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    // Estados de UI
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("TODAS");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeModal, setActiveModal] = useState<ProductModalType>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductEntity | null>(null);

    // Estados de carga
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Lectura Reactiva desde IndexedDB
    const products = useLiveQuery(
        () => db.products.filter(p => p.deletedAt === null).toArray(),
        []
    ) || [];

    // 1.5. Obtener lista de categorías únicas para el filtro
    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.category || 'Sin Categoría'));
        return ["TODAS", ...Array.from(uniqueCategories)];
    }, [products]);

    // 2. Filtrado y Búsqueda
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const productCategory = p.category || 'Sin Categoría';

            // Filtro por categoría
            const matchCategory = selectedCategory === "TODAS" || productCategory === selectedCategory;

            // Filtro por texto (buscando en nombre, código/códigoBarras, categoría y descripción)
            const term = searchTerm.toLowerCase();
            const matchSearch =
                p.name.toLowerCase().includes(term) ||
                p.code.toLowerCase().includes(term) ||
                productCategory.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term));

            return matchCategory && matchSearch;
        });
    }, [products, searchTerm, selectedCategory]);

    // 3. Paginación
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // <-- Handler para el select de categorías
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // 4. Control de Modales
    const openModal = (type: ProductModalType, product?: ProductEntity) => {
        setSelectedProduct(product || null);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedProduct(null);
    };

    // 5. OPERACIONES CRUD (Offline-First / Dexie + Outbox)
    const addProduct = useCallback(async (productData: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version' | 'companyId'>) => {
        if (!currentCompanyId || !currentDeviceId) {
            setError('Error de sesión: No se identificó la empresa o el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            const newProduct: ProductEntity = {
                ...productData,
                id: uuidv4(),
                companyId: currentCompanyId,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1,
            };

            await db.transaction('rw', db.products, db.outboxEvents, async () => {
                await db.products.add(newProduct);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'product',
                    entityId: newProduct.id,
                    operation: 'UPSERT',
                    payloadJson: JSON.stringify(newProduct),
                    clientUpdatedAt: now,
                    entityVersion: newProduct.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error adding product:", err);
            setError(err.message || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    }, [currentCompanyId, currentDeviceId]);

    const updateProduct = useCallback(async (id: string, updates: Partial<ProductEntity>) => {
        if (!currentDeviceId) {
            setError('Error de sesión: No se identificó el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.products, db.outboxEvents, async () => {
                const existing = await db.products.get(id);
                if (!existing) throw new Error("Producto no encontrado");

                const updated: ProductEntity = {
                    ...existing,
                    ...updates,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.products.put(updated);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'product',
                    entityId: updated.id,
                    operation: 'UPSERT',
                    payloadJson: JSON.stringify(updated),
                    clientUpdatedAt: now,
                    entityVersion: updated.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error updating product:", err);
            setError(err.message || 'Error al actualizar el producto');
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

    const deleteProduct = useCallback(async (id: string) => {
        if (!currentDeviceId) {
            setError('Error de sesión: No se identificó el dispositivo.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const now = new Date().toISOString();
            await db.transaction('rw', db.products, db.outboxEvents, async () => {
                const existing = await db.products.get(id);
                if (!existing) throw new Error("Producto no encontrado");

                const deleted: ProductEntity = {
                    ...existing,
                    deletedAt: now,
                    updatedAt: now,
                    version: existing.version + 1,
                };

                await db.products.put(deleted); // Soft delete
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'product',
                    entityId: deleted.id,
                    operation: 'DELETE',
                    payloadJson: JSON.stringify(deleted),
                    clientUpdatedAt: now,
                    entityVersion: deleted.version,
                    status: 'PENDING',
                    createdAt: now,
                });
            });
            closeModal();
        } catch (err: any) {
            console.error("Error deleting product:", err);
            setError(err.message || 'Error al eliminar el producto');
        } finally {
            setLoading(false);
        }
    }, [currentDeviceId]);

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
        totalItems: filteredProducts.length,
        activeModal,
        openModal,
        closeModal,
        selectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
        error
    };
};