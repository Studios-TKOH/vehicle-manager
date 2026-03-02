import { useProducts } from "@hooks/useProducts";
import styles from "@styles/modules/Products.module.css";
import { Search, Plus, Eye, Edit2, Trash2, Tag, Barcode, Activity, PackageSearch } from "lucide-react";
import { ProductDetailsModal } from "@components/products/ProductDetailsModal";
import { ProductFormModal } from "@components/products/ProductFormModal";
import { ProductDeleteModal } from "@components/products/ProductDeleteModal";
import { useState, useEffect } from "react";

export const Products = () => {
  const {
    searchTerm, handleSearch, categories, selectedCategory, handleCategoryChange,
    currentPage,setCurrentPage,totalPages,currentProducts, totalItems, activeModal, openModal, closeModal, selectedProduct
  } = useProducts();

  const [formData, setFormData] = useState({
    codigoBarras: "", nombre: "", categoria: "", precioVenta: "", unidadMedida: "NIU", frecuenciaCambioKm: "", afectacionIgv: "10"
  });

  useEffect(() => {
    if (selectedProduct) setFormData(selectedProduct);
    else setFormData({ codigoBarras: "", nombre: "", categoria: "", precioVenta: "", unidadMedida: "NIU", frecuenciaCambioKm: "", afectacionIgv: "10" });
  }, [selectedProduct]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><PackageSearch className="text-blue-600" /> Inventario</h1>
        <button className={styles.addButton} onClick={() => openModal("add")}><Plus size={20} /> NUEVO PRODUCTO</button>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.filtersGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Buscar por código o nombre..." value={searchTerm} onChange={handleSearch} />
          </div>
          <select className={styles.filterSelect} value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map(cat => <option key={cat} value={cat}>{cat === "TODAS" ? "Todas las Categorías" : cat}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr><th>CÓDIGO</th><th>PRODUCTO</th><th>CATEGORÍA</th><th>FREC. CAMBIO</th><th>PRECIO</th><th className="text-center">ACCIONES</th></tr>
          </thead>
          <tbody>
            {currentProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td><div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 border border-slate-200 rounded w-fit font-mono text-xs"><Barcode size={12} />{product.codigoBarras}</div></td>
                <td><strong className="block text-slate-800 text-sm">{product.nombre}</strong><span className="font-black text-[10px] text-slate-400 uppercase tracking-widest">{product.unidadMedida}</span></td>
                <td><span className={styles.categoryBadge}>{product.categoria}</span></td>
                <td>{product.frecuenciaCambioKm ? <span className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full w-fit font-bold text-orange-600 text-xs"><Activity size={12} />{product.frecuenciaCambioKm.toLocaleString()} KM</span> : <span className="text-slate-300 text-xs italic">N/A</span>}</td>
                <td><span className={styles.priceText}>S/ {Number(product.precioVenta).toFixed(2)}</span></td>
                <td className="text-center">
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
                      title="Eliminar Cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
      <ProductDetailsModal isOpen={activeModal === 'details'} onClose={closeModal} product={selectedProduct} />
      <ProductFormModal isOpen={activeModal === 'add' || activeModal === 'edit'} onClose={closeModal} mode={activeModal as any} formData={formData} categories={categories} onChange={(e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })} onSave={closeModal} />
      <ProductDeleteModal isOpen={activeModal === 'delete'} onClose={closeModal} product={selectedProduct} />
    </div>
  );
};