import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import styles from "../styles/modules/Products.module.css";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  PackageSearch,
  Barcode,
  Tag,
  DollarSign,
  Activity,
  FileDigit,
  RefreshCw,
} from "lucide-react";

export const Products = () => {
  const {
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
    totalItems,
    activeModal,
    openModal,
    closeModal,
    selectedProduct,
  } = useProducts();

  // Estado local para el formulario
  const [formData, setFormData] = useState({
    codigoBarras: "",
    nombre: "",
    categoria: "",
    precioVenta: "",
    unidadMedida: "NIU",
    frecuenciaCambioKm: "",
    afectacionIgv: "10",
  });

  useEffect(() => {
    if (activeModal === "edit" && selectedProduct) {
      setFormData(selectedProduct);
    } else if (activeModal === "add") {
      setFormData({
        codigoBarras: "",
        nombre: "",
        categoria: "",
        precioVenta: "",
        unidadMedida: "NIU",
        frecuenciaCambioKm: "",
        afectacionIgv: "10",
      });
    }
  }, [activeModal, selectedProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <PackageSearch className="text-blue-600 w-8 h-8" /> Inventario de
          Productos y Servicios
        </h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      {/* Controles: Búsqueda y Paginación */}
      <div className={styles.controlsContainer}>
        <div className={styles.filtersGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por código, nombre o descripción..."
              className={styles.searchInput}
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

        <div className={styles.paginationSelect}>
          <label>Mostrar</label>
          <select
            className={styles.selectInput}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <label>registros</label>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto / Servicio</th>
              <th>Categoría</th>
              <th>Frec. Cambio</th>
              <th>Precio Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded w-fit border border-slate-200">
                      <Barcode className="w-3.5 h-3.5" />
                      {product.codigoBarras}
                    </div>
                  </td>
                  <td>
                    <strong className="text-slate-800 block">
                      {product.nombre}
                    </strong>
                    <span className="text-xs text-slate-500">
                      Unidad: {product.unidadMedida} • IGV:{" "}
                      {product.afectacionIgv === "10" ? "Gravado" : "Exonerado"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {product.categoria}
                    </span>
                  </td>
                  <td>
                    {product.frecuenciaCambioKm ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full w-fit">
                        <Activity className="w-4 h-4" />{" "}
                        {product.frecuenciaCambioKm.toLocaleString()} km
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm italic">N/A</span>
                    )}
                  </td>
                  <td>
                    <span className={styles.priceText}>
                      S/ {Number(product.precioVenta).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", product)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Inferior */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-slate-500">
          Mostrando {currentProducts.length} de {totalItems} registros
        </span>
        <div className="flex gap-2">
          <button
            className={styles.btnSecondary}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
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

      {/* ================= MODALES ================= */}

      {/* MODAL: VER DETALLES */}
      {activeModal === "details" && selectedProduct && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalContent} max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Tag className="text-blue-600" /> Detalle del Producto
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className="flex flex-col items-center justify-center mb-6 p-6 bg-slate-50 border border-slate-200 rounded-xl border-dashed">
                <Barcode className="w-16 h-16 text-slate-400 mb-2" />
                <span className="font-mono text-lg font-bold tracking-widest text-slate-700">
                  {selectedProduct.codigoBarras}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1">
                {selectedProduct.nombre}
              </h3>
              <div className="flex gap-2 mb-6">
                <span className={styles.categoryBadge}>
                  {selectedProduct.categoria}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Unidad: {selectedProduct.unidadMedida}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold uppercase text-blue-600 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Precio Venta
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    S/ {Number(selectedProduct.precioVenta).toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600/70 mt-1">
                    Afectación IGV: Código {selectedProduct.afectacionIgv}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs font-bold uppercase text-orange-600 mb-1 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Vida Útil
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {selectedProduct.frecuenciaCambioKm
                      ? `${selectedProduct.frecuenciaCambioKm / 1000}k KM`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-orange-600/70 mt-1">
                    Frecuencia de cambio
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR / EDITAR */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalContent} max-w-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {activeModal === "add"
                  ? "Registrar Nuevo Producto"
                  : "Editar Producto"}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <form className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <FileDigit className="w-4 h-4 text-slate-400" /> Código de
                    Barras / SKU
                  </label>
                  <input
                    type="text"
                    name="codigoBarras"
                    className={styles.input}
                    value={formData.codigoBarras}
                    onChange={handleInputChange}
                    placeholder="Ej: 7751234567801"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Tag className="w-4 h-4 text-slate-400" /> Categoría
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    className={styles.input}
                    value={formData.categoria}
                    onChange={handleInputChange}
                    placeholder="Ej: Aceites de Motor, Filtros..."
                    list="categorias-list"
                  />
                  {/* Datalist para autocompletar con categorías existentes */}
                  <datalist id="categorias-list">
                    {categories
                      .filter((c) => c !== "TODAS")
                      .map((c) => (
                        <option key={c} value={c} />
                      ))}
                  </datalist>
                </div>

                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>
                    Nombre del Producto / Servicio
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className={styles.input}
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Aceite Castrol Magnatec 10W-40 (Galón)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Precio de Venta</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputPrefix}>S/</span>
                    <input
                      type="number"
                      step="0.01"
                      name="precioVenta"
                      className={styles.input}
                      value={formData.precioVenta}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Unidad de Medida (SUNAT)
                  </label>
                  <select
                    name="unidadMedida"
                    className={styles.input}
                    value={formData.unidadMedida}
                    onChange={handleInputChange}
                  >
                    <option value="NIU">NIU - Unidad / Servicio</option>
                    <option value="GAL">GAL - Galón</option>
                    <option value="LTR">LTR - Litro</option>
                    <option value="KGM">KGM - Kilogramo</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label
                    className={styles.label}
                    title="Importante para predecir el próximo mantenimiento del vehículo en facturación."
                  >
                    Frecuencia de Cambio (KM)
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      name="frecuenciaCambioKm"
                      className={styles.input}
                      value={formData.frecuenciaCambioKm}
                      onChange={handleInputChange}
                      placeholder="Ej: 5000"
                    />
                    <span
                      className={`${styles.inputPrefix} border-l border-r-0`}
                    >
                      KM
                    </span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Afectación IGV</label>
                  <select
                    name="afectacionIgv"
                    className={styles.input}
                    value={formData.afectacionIgv}
                    onChange={handleInputChange}
                  >
                    <option value="10">10 - Gravado - Operación Onerosa</option>
                    <option value="20">
                      20 - Exonerado - Operación Onerosa
                    </option>
                    <option value="30">
                      30 - Inafecto - Operación Onerosa
                    </option>
                  </select>
                </div>
              </form>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cancelar
              </button>
              <button className={styles.btnPrimary} onClick={closeModal}>
                {activeModal === "add"
                  ? "Guardar Producto"
                  : "Actualizar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR */}
      {activeModal === "delete" && selectedProduct && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalContent} max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalBody}>
              <div className="text-center pt-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  ¿Eliminar Producto?
                </h3>
                <p className="text-slate-600 mb-6">
                  Estás a punto de eliminar{" "}
                  <strong className="text-slate-800">
                    {selectedProduct.nombre}
                  </strong>
                  . Si este producto ya fue facturado, se mantendrá en el
                  historial de ventas por requerimiento de SUNAT, pero ya no
                  estará disponible para nuevas ventas.
                </p>
                <div className="flex justify-center gap-3">
                  <button className={styles.btnSecondary} onClick={closeModal}>
                    Cancelar
                  </button>
                  <button className={styles.btnDanger} onClick={closeModal}>
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
