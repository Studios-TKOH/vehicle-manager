import React, { useEffect, useRef, useState } from "react";
import {
  X,
  FileDigit,
  Tag,
  DollarSign,
  Save,
  ArrowLeft,
  Wand2,
} from "lucide-react";
import styles from "@styles/modules/products.module.css";
import type { ProductFormData } from "@/types/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  formData: ProductFormData;
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
  const [autoClassified, setAutoClassified] = useState(false);
  const prevNameRef = useRef(formData.name);

  useEffect(() => {
    if (!isOpen) {
      setAutoClassified(false);
      prevNameRef.current = "";
      return;
    }

    const currentName = formData.name.toLowerCase();
    const prevName = prevNameRef.current.toLowerCase();

    if (currentName && currentName !== prevName) {
      let newCategory = formData.category;
      let newUnitType = formData.unitType;
      let shouldUpdate = false;


      if (currentName.includes("filtro")) {
        newCategory = "FILTROS";
        shouldUpdate = true;
      } else if (
        currentName.includes("aceite") ||
        currentName.includes("lubricante")
      ) {
        newCategory = "LUBRICANTES";
        shouldUpdate = true;
      } else if (
        currentName.includes("bateria") ||
        currentName.includes("batería")
      ) {
        newCategory = "BATERIAS";
        shouldUpdate = true;
      } else if (
        currentName.includes("llanta") ||
        currentName.includes("neumatico") ||
        currentName.includes("neumático")
      ) {
        newCategory = "LLANTAS";
        shouldUpdate = true;
      } else if (
        currentName.includes("freno") ||
        currentName.includes("pastilla")
      ) {
        newCategory = "FRENOS";
        shouldUpdate = true;
      } else if (
        currentName.includes("servicio") ||
        currentName.includes("mano de obra") ||
        currentName.includes("mantenimiento")
      ) {
        newCategory = "SERVICIOS";
        shouldUpdate = true;
      }

      if (currentName.includes("galon") || currentName.includes("galón")) {
        newUnitType = "GAL";
        shouldUpdate = true;
      } else if (
        currentName.includes("litro") ||
        currentName.includes("botella de aceite") ||
        currentName.includes("cuarto de aceite")
      ) {
        newUnitType = "LTR";
        shouldUpdate = true;
      } else if (currentName.includes("balde")) {
        newUnitType = "NIU";
        shouldUpdate = true;
      } else if (
        currentName.includes("servicio") ||
        currentName.includes("mano de obra")
      ) {
        newUnitType = "NIU";
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        if (newCategory !== formData.category) {
          onChange({
            target: { name: "category", value: newCategory },
          } as React.ChangeEvent<HTMLInputElement>);
        }

        if (newUnitType !== formData.unitType) {
          onChange({
            target: { name: "unitType", value: newUnitType },
          } as React.ChangeEvent<HTMLSelectElement>);
        }
        setAutoClassified(true);
      }
    }

    prevNameRef.current = formData.name;
  }, [formData.name, isOpen, onChange]);

  if (!isOpen) return null;

  const handleAutoGenerateSKU = () => {
    const prefix =
      formData.category && formData.category !== "TODAS"
        ? formData.category.substring(0, 3).toUpperCase()
        : "SKU";

    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const generatedSku = `${prefix}-${randomNum}`;

    onChange({
      target: { name: "code", value: generatedSku },
    } as React.ChangeEvent<HTMLInputElement>);
  };

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
              <div className={styles.formGroupWide}>
                <label className={styles.label}>
                  Nombre descriptivo del Producto o Servicio
                </label>
                <input
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={onChange}
                  placeholder="Ej: Aceite Castrol Magnatec 10W-40 Galón..."
                  autoComplete="off"
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
                  autoComplete="off"
                />
                <datalist id="cat-list">
                  {categories
                    .filter((c) => c !== "TODAS" && c !== "General")
                    .map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.labelWithIcon}>
                  <FileDigit size={14} /> Código de Barras / SKU
                </label>
                <div className={styles.inputGroup}>
                  <input
                    name="code"
                    className={styles.inputWithBtnSuffix}
                    value={formData.code}
                    onChange={onChange}
                    placeholder="Ej: 7751234..."
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerateSKU}
                    className={styles.btnInputSuffix}
                    title="Generar código SKU automáticamente"
                  >
                    <Wand2 size={14} /> Auto
                  </button>
                </div>
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
                  <option value="CAJ">CAJ - Caja</option>
                  <option value="BLD">BLD - Balde</option>
                </select>
              </div>
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
