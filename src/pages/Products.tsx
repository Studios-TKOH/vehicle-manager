import { useState, useEffect } from "react";
import { useProducts } from "@hooks/useProducts";
import styles from "@styles/modules/products.module.css";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Barcode,
  Activity,
  PackageSearch,
} from "lucide-react";
import { ProductDetailsModal } from "@components/products/ProductDetailsModal";
import { ProductFormModal } from "@components/products/ProductFormModal";
import { ProductDeleteModal } from "@components/products/ProductDeleteModal";
import type { ProductFormData } from "@/types/products";

export const Products = () => {
  const {
    searchTerm,
    handleSearch,
    categories,
    selectedCategory,
    handleCategoryChange,
    currentPage,
    setCurrentPage,
    totalPages,
    currentProducts,
    totalItems,
    activeModal,
    openModal,
    closeModal,
    selectedProduct,
    deleteProduct,
    addProduct,
    updateProduct, // <- Traemos las funciones de Dexie
  } = useProducts();

  // 1. Tipado fuerte alineado a Dexie
  const [formData, setFormData] = useState<ProductFormData>({
    code: "",
    name: "",
    category: "General",
    price: 0,
    unitType: "NIU",
    description: "",
    isActive: true,
  });

  // 2. Prevenir el warning de "Uncontrolled Input" garantizando fallbacks
  useEffect(() => {
    if (activeModal === "edit" && selectedProduct) {
      setFormData({
        code: selectedProduct.code || "",
        name: selectedProduct.name || "",
        category: selectedProduct.category || "General",
        price: selectedProduct.price || 0,
        unitType: selectedProduct.unitType || "NIU",
        description: selectedProduct.description || "",
        isActive: selectedProduct.isActive ?? true,
      });
    } else if (activeModal === "add") {
      setFormData({
        code: "",
        name: "",
        category: "General",
        price: 0,
        unitType: "NIU",
        description: "",
        isActive: true,
      });
    }
  }, [activeModal, selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Función para Guardar en Dexie LocalDB
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.code) {
      alert("Por favor, llena los campos obligatorios (Código y Nombre).");
      return;
    }

    const payload = {
      code: formData.code,
      name: formData.name,
      category: formData.category,
      description: formData.description || null,
      price: Number(formData.price),
      unitType: formData.unitType,
      isActive: formData.isActive,
    };

    if (activeModal === "add") {
      await addProduct(payload);
    } else if (activeModal === "edit" && selectedProduct) {
      await updateProduct(selectedProduct.id, payload);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      closeModal();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <PackageSearch className="text-blue-600" /> Inventario
        </h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus size={20} /> NUEVO PRODUCTO
        </button>
      </div>

      <div className={styles.controlsContainer}>
        <div className="flex md:flex-row flex-col items-center gap-4 w-full">
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "TODAS" ? "Todas las Categorías" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>FREC. CAMBIO</th>
              <th>PRECIO</th>
              <th className={styles.tableCellCenter}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product: any) => (
                <tr key={product.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.skuBadgeWrapper}>
                      <Barcode size={12} />
                      {product.code}
                    </div>
                  </td>
                  <td>
                    <strong className={styles.productName}>
                      {product.name}
                    </strong>
                    <span className={styles.productSub}>
                      {product.unitType}
                    </span>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.category || "General"}
                    </span>
                  </td>
                  <td>
                    {/* Extra: Si en el futuro añades mantenimiento predictivo a la BD, estará mapeado aquí */}
                    {product.maintenanceIntervalKm ? (
                      <span className={styles.maintenanceBadge}>
                        <Activity size={12} />
                        {product.maintenanceIntervalKm.toLocaleString()} KM
                      </span>
                    ) : (
                      <span className={styles.maintenanceNone}>N/A</span>
                    )}
                  </td>
                  <td>
                    <span className={styles.priceText}>
                      S/ {Number(product.price).toFixed(2)}
                    </span>
                  </td>
                  <td className={styles.tableCellCenter}>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Expediente"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar Datos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar Producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.tableEmptyRow}>
                  <div className={styles.tableEmptyState}>
                    <Search className={styles.tableEmptyIcon} />
                    <span className={styles.tableEmptyText}>
                      No se encontraron productos.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <span className={styles.paginationInfo}>
          Mostrando {currentProducts.length} de {totalItems} registros
        </span>
        <div className={styles.paginationControls}>
          <button
            className={styles.btnSecondary}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span className={styles.paginationCurrentPage}>
            Página {currentPage} de {totalPages || 1}
          </span>
          <button
            className={styles.btnSecondary}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales Modularizados */}
      <ProductDetailsModal
        isOpen={activeModal === "details"}
        onClose={closeModal}
        product={selectedProduct}
      />

      <ProductFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        onClose={closeModal}
        mode={activeModal as any}
        formData={formData}
        categories={categories}
        onChange={handleInputChange}
        onSubmit={handleSaveProduct}
      />

      <ProductDeleteModal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        product={selectedProduct}
      />
    </div>
  );
};
