import {
  X,
  FileDigit,
  Tag,
  DollarSign,
  // Activity,
  Save,
  ArrowLeft,
} from "lucide-react";
import styles from "@styles/modules/products.module.css";
import type { ProductFormData } from "@/types/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  formData: ProductFormData; // Tipado estricto
  categories: string[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: () => void;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  mode,
  formData,
  categories,
  onChange,
  onSubmit,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.formModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              <Tag size={28} className={styles.modalTitleIcon} />
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>
                {mode === "add" ? "Nuevo Producto" : "Editar Producto"}
              </span>
              <span className={styles.modalTitleSubtext}>
                Rellena los campos para registrar un nuevo item en el
                inventario.
              </span>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form>
            <span className={styles.formSectionTitleFirst}>
              Información del Producto
            </span>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.labelWithIcon}>
                  <FileDigit size={14} /> Código de Barras / SKU
                </label>
                <input
                  name="code"
                  className={styles.input}
                  value={formData.code}
                  onChange={onChange}
                  placeholder="Ej: 7751234..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.labelWithIcon}>
                  <Tag size={14} /> Categoría
                </label>
                <input
                  name="category"
                  className={styles.input}
                  value={formData.category}
                  onChange={onChange}
                  list="cat-list"
                  placeholder="Selecciona o escribe..."
                />
                <datalist id="cat-list">
                  {categories
                    .filter((c) => c !== "TODAS")
                    .map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>
              </div>

              <div className={styles.formGroupWide}>
                <label className={styles.label}>
                  Nombre descriptivo del Producto o Servicio
                </label>
                <input
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={onChange}
                  placeholder="Ej: Aceite Castrol Magnatec 10W-40..."
                />
              </div>
            </div>

            <span className={styles.formSectionTitle}>
              Configuración de Venta y Servicio
            </span>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.labelWithIcon}>
                  <DollarSign size={14} /> Precio de Venta
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.inputPrefix}>S/</span>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className={styles.inputWithPrefix}
                    value={formData.price}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Unidad de Medida</label>
                <select
                  name="unitType"
                  className={styles.input}
                  value={formData.unitType}
                  onChange={onChange}
                >
                  <option value="NIU">NIU - Unidad / Servicio</option>
                  <option value="GAL">GAL - Galón</option>
                  <option value="LTR">LTR - Litro</option>
                </select>
              </div>

              {/* Extra: Campo opcional para mantenimiento si lo consideras en el futuro */}
              {/* <div className={styles.formGroup}>
                                <label className={styles.labelWithIcon}>
                                    <Activity size={14} /> Frecuencia de Cambio
                                </label>
                                <div className={styles.inputGroup}>
                                    <input 
                                        type="number" 
                                        name="maintenanceIntervalKm" 
                                        className={styles.inputWithSuffix} 
                                        value={formData.maintenanceIntervalKm} 
                                        onChange={onChange} 
                                    />
                                    <span className={styles.inputSuffix}>KM</span>
                                </div>
                            </div> */}

              {/* Extra: Afectación IGV si la necesitas en el futuro */}
              {/* <div className={styles.formGroup}>
                                <label className={styles.label}>Afectación IGV</label>
                                <select name="taxType" className={styles.input} value={formData.taxType} onChange={onChange}>
                                    <option value="10">10 - Gravado</option>
                                    <option value="20">20 - Exonerado</option>
                                </select>
                            </div> */}
            </div>
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            <ArrowLeft size={16} /> CANCELAR
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onSubmit}
          >
            <Save size={16} /> GUARDAR CAMBIOS
          </button>
        </div>
      </div>
    </div>
  );
};
