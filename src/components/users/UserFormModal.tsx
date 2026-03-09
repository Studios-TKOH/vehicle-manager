import React, { useState, useEffect } from "react";
import { X, Users, Save } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { UserEntity, BranchEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  userItem: UserEntity | null;
  branches: BranchEntity[];
  onSave: (data: any, tempPassword?: string) => Promise<void>;
}

export const UserFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  userItem,
  branches,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "VENDEDOR",
    defaultBranchId: branches.length > 0 ? branches[0].id : "",
    password: "", // Solo se usa al crear
  });

  useEffect(() => {
    if (isOpen && userItem && mode === "edit") {
      setFormData({
        nombre: userItem.nombre || "",
        email: userItem.email || "",
        rol: userItem.rol || "VENDEDOR",
        defaultBranchId:
          userItem.defaultBranchId ||
          (branches.length > 0 ? branches[0].id : ""),
        password: "",
      });
    } else if (!isOpen) {
      setFormData({
        nombre: "",
        email: "",
        rol: "VENDEDOR",
        defaultBranchId: branches.length > 0 ? branches[0].id : "",
        password: "",
      });
    }
  }, [isOpen, userItem, mode, branches]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.defaultBranchId) {
      alert("Nombre, Email y Sucursal son obligatorios.");
      return;
    }

    const dataToSave = {
      nombre: formData.nombre,
      email: formData.email.toLowerCase(),
      rol: formData.rol,
      defaultBranchId: formData.defaultBranchId,
      activo: true,
    };

    await onSave(dataToSave, mode === "add" ? formData.password : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBox}>
            <div className={styles.modalTitleIconBox}>
              <Users className={styles.iconMedium} />
            </div>
            <span className={styles.modalTitleText}>
              {mode === "add" ? "Registrar Nuevo Usuario" : "Editar Usuario"}
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconMedium} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div className={styles.formGroupWide}>
              <label className={styles.label}>Nombre Completo</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="usuario@empresa.com"
                required
              />
            </div>

            {mode === "add" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña Temporal</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="******"
                  required={mode === "add"}
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Rol del Sistema</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor / Cajero</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Sucursal Principal</label>
              <select
                name="defaultBranchId"
                value={formData.defaultBranchId}
                onChange={handleChange}
                className={styles.input}
                required
              >
                <option value="" disabled>
                  Seleccione una sucursal...
                </option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre}
                  </option>
                ))}
              </select>
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
