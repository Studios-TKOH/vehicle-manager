import React, { useState, useEffect } from "react";
import { X, FileText, Save } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { DocumentSeriesEntity, BranchEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  seriesItem: DocumentSeriesEntity | null;
  branches: BranchEntity[];
  onSave: (data: any) => Promise<void>;
}

export const SeriesFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  seriesItem,
  branches,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    branchId: branches.length > 0 ? branches[0].id : "",
    docType: "03",
    series: "",
    nextCorrelative: 1,
    active: true,
  });

  useEffect(() => {
    if (isOpen && seriesItem && mode === "edit") {
      setFormData({
        branchId: seriesItem.branchId || "",
        docType: seriesItem.docType || "03",
        series: seriesItem.series || "",
        nextCorrelative: seriesItem.nextCorrelative || 1,
        active: seriesItem.active ?? true,
      });
    } else if (!isOpen) {
      setFormData({
        branchId: branches.length > 0 ? branches[0].id : "",
        docType: "03",
        series: "",
        nextCorrelative: 1,
        active: true,
      });
    }
  }, [isOpen, seriesItem, mode, branches]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    const finalValue = name === "series" ? value.toUpperCase() : value;

    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.series || !formData.branchId) {
      alert("La serie y la sucursal son obligatorias.");
      return;
    }

    await onSave({
      ...formData,
      nextCorrelative: Number(formData.nextCorrelative),
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBox}>
            <div className={styles.modalTitleIconBox}>
              <FileText className={styles.iconMedium} />
            </div>
            <span className={styles.modalTitleText}>
              {mode === "add" ? "Registrar Nueva Serie" : "Editar Serie"}
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconMedium} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div className={styles.formGroupWide}>
              <label className={styles.label}>Asignar a Sucursal</label>
              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="" disabled>
                  Seleccione una sucursal...
                </option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.codigoBase} - {b.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Comprobante</label>
              <select
                name="docType"
                value={formData.docType}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="01">01 - FACTURA</option>
                <option value="03">03 - BOLETA</option>
                <option value="07">07 - NOTA DE CRÉDITO</option>
                <option value="08">08 - NOTA DE DÉBITO</option>
                <option value="PR">PR - PROFORMA (Uso Interno)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Número de Serie</label>
              <input
                name="series"
                value={formData.series}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: F001, B001"
                required
                maxLength={4}
                style={{ textTransform: "uppercase" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Correlativo Siguiente</label>
              <input
                type="number"
                name="nextCorrelative"
                value={formData.nextCorrelative}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: 1"
                required
                min={1}
              />
            </div>
          </div>
        </form>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSubmit}
          >
            <Save className={styles.iconMedium} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
