import React, { useState, useEffect } from "react";
import { X, Store, Save } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { BranchEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  branch: BranchEntity | null;
  onSave: (data: any) => Promise<void>;
}

export const BranchFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  branch,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    codigoBase: "",
    nombre: "",
    direccion: "",
    telefono: "",
    sunatCodigoSucursal: "",
  });

  useEffect(() => {
    if (isOpen && branch && mode === "edit") {
      setFormData({
        codigoBase: branch.codigoBase || "",
        nombre: branch.nombre || "",
        direccion: branch.direccion || "",
        telefono: branch.telefono || "",
        sunatCodigoSucursal: branch.sunatCodigoSucursal || "",
      });
    } else if (!isOpen) {
      setFormData({
        codigoBase: "",
        nombre: "",
        direccion: "",
        telefono: "",
        sunatCodigoSucursal: "",
      });
    }
  }, [isOpen, branch, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.codigoBase) {
      alert("El código y el nombre son obligatorios.");
      return;
    }
    await onSave({
      ...formData,
      telefono: formData.telefono || null,
      sunatCodigoSucursal: formData.sunatCodigoSucursal || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBox}>
            <div className={styles.modalTitleIconBox}>
              <Store className={styles.iconMedium} />
            </div>
            <span className={styles.modalTitleText}>
              {mode === "add" ? "Registrar Sucursal" : "Editar Sucursal"}
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconMedium} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Código Interno (Ej: S001)</label>
              <input
                name="codigoBase"
                value={formData.codigoBase}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Código SUNAT (Ej: 0001)</label>
              <input
                name="sunatCodigoSucursal"
                value={formData.sunatCodigoSucursal}
                onChange={handleChange}
                className={styles.input}
                placeholder="0000 para Matriz"
              />
            </div>
            <div className={styles.formGroupWide}>
              <label className={styles.label}>Nombre de la Sucursal</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroupWide}>
              <label className={styles.label}>Dirección Completa</label>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={styles.input}
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
