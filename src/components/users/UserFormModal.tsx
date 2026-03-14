import React, { useState, useEffect } from "react";
import { X, Users, Save, KeyRound, ShieldCheck } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { UserEntity, BranchEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  userItem: UserEntity | null;
  branches: BranchEntity[];
  currentUserId?: string;
  onSave: (data: any, tempPassword?: string) => Promise<void>;
}

export const UserFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  userItem,
  branches,
  currentUserId,
  onSave,
}) => {
  const isCurrentUser = mode === "edit" && userItem?.id === currentUserId;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "VENDEDOR",
    defaultBranchId: branches.length > 0 ? branches[0].id : "",
    branchIds: [] as string[],
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (isOpen && userItem && mode === "edit") {
      setFormData({
        nombre: userItem.nombre || "",
        email: userItem.email || "",
        rol: userItem.rol || "VENDEDOR",
        defaultBranchId:
          userItem.defaultBranchId ||
          (branches.length > 0 ? branches[0].id : ""),
        branchIds: userItem.branchIds || [],
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } else if (!isOpen) {
      setFormData({
        nombre: "",
        email: "",
        rol: "VENDEDOR",
        defaultBranchId: branches.length > 0 ? branches[0].id : "",
        branchIds: [],
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    }
  }, [isOpen, userItem, mode, branches]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branchId: string) => {
    setFormData((prev) => ({
      ...prev,
      branchIds: prev.branchIds.includes(branchId)
        ? prev.branchIds.filter((id) => id !== branchId)
        : [...prev.branchIds, branchId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.defaultBranchId) {
      alert("Nombre, Email y Sucursal Principal son obligatorios.");
      return;
    }

    if (isChangingPassword) {
      if (formData.newPassword.length < 6) {
        alert("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
    }

    const dataToSave = {
      nombre: formData.nombre,
      email: formData.email.toLowerCase(),
      rol: formData.rol,
      defaultBranchId: formData.defaultBranchId,
      branchIds: formData.branchIds,
      activo: true,
      ...(isChangingPassword && { newPassword: formData.newPassword }),
    };

    await onSave(dataToSave, mode === "add" ? formData.password : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div
          className={
            isCurrentUser ? styles.modalHeaderIsMe : styles.modalHeader
          }
        >
          <div className={styles.modalTitleBox}>
            <div
              className={
                isCurrentUser
                  ? styles.modalTitleIconBoxIsMe
                  : styles.modalTitleIconBox
              }
            >
              {isCurrentUser ? (
                <ShieldCheck className={styles.iconMedium} />
              ) : (
                <Users className={styles.iconMedium} />
              )}
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>
                {isCurrentUser
                  ? "Mi Perfil de Usuario"
                  : mode === "add"
                    ? "Registrar Nuevo Usuario"
                    : "Editar Usuario"}
              </span>
              <span className={styles.modalTitleSubtext}>
                {isCurrentUser
                  ? "Configura tus datos personales y credenciales."
                  : "Asigna roles y permisos de sucursal."}
              </span>
            </div>
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
              <label className={styles.label}>Correo Electrónico (Login)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="usuario@empresa.com"
                required
                disabled={isCurrentUser}
                title={isCurrentUser ? "Tu correo actual de sesión" : ""}
              />
            </div>

            {mode === "add" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Contraseña Inicial</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Mínimo 6 caracteres"
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
                disabled={isCurrentUser && formData.rol === "OWNER"}
              >
                <option value="OWNER">Propietario (Acceso Total)</option>
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

            {/* PERMISOS MÚLTIPLES SUCURSALES */}
            {formData.rol !== "OWNER" && (
              <div className={styles.formGroupWide}>
                <label className={styles.label}>
                  Permisos de acceso a sucursales adicionales
                </label>
                <div className={styles.checkboxGroup}>
                  {branches.map((b) => {
                    const isChecked =
                      formData.branchIds.includes(b.id) ||
                      formData.defaultBranchId === b.id;
                    return (
                      <label
                        key={b.id}
                        className={
                          isChecked
                            ? styles.checkboxLabelChecked
                            : styles.checkboxLabel
                        }
                      >
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={isChecked}
                          onChange={() => handleBranchToggle(b.id)}
                          disabled={formData.defaultBranchId === b.id}
                        />
                        {b.nombre}{" "}
                        {formData.defaultBranchId === b.id && "(Principal)"}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CAMBIAR MI CONTRASEÑA */}
            {isCurrentUser && (
              <div className={styles.passwordSection}>
                <label className={styles.passwordToggleLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={isChangingPassword}
                    onChange={(e) => setIsChangingPassword(e.target.checked)}
                  />
                  <span className={styles.passwordToggleText}>
                    <KeyRound size={16} className="text-slate-400" />
                    Quiero cambiar mi contraseña
                  </span>
                </label>

                {isChangingPassword && (
                  <div className={styles.passwordGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nueva Contraseña</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        required={isChangingPassword}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${styles.input} ${formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? "border-rose-500 bg-rose-50" : ""}`}
                        placeholder="Repite la nueva contraseña"
                        required={isChangingPassword}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
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
            <Save className={styles.iconMedium} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
