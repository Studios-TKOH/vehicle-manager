import { X, Search, Loader2 } from "lucide-react";
import styles from "@styles/modules/customers.module.css";
import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";
import type { CustomerFormData } from "@/types/customers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  formData: CustomerFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSearchApi: () => void;
  onSubmit: () => void;
  isSearching: boolean;
  apiSuccess: boolean;
}

export const CustomerFormModal = ({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onSearchApi,
  onSubmit,
  isSearching,
  apiSuccess,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === "add" ? "Nuevo Cliente" : "Editar Cliente"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de Documento</label>
              <Select
                name="tipoDocumentoIdentidad"
                value={formData.tipoDocumentoIdentidad}
                onChange={onChange}
              >
                <option value="6">RUC (Empresa / Persona con Negocio)</option>
                <option value="1">DNI (Persona Natural)</option>
                <option value="4">CE (Carnet de Extranjería)</option>
              </Select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Número de Documento
                {apiSuccess && (
                  <span className={styles.apiValidationSuccess}>
                    ✔ Validado
                  </span>
                )}
              </label>
              <div className={styles.apiSearchWrapper}>
                <Input
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={onChange}
                  maxLength={formData.tipoDocumentoIdentidad === "6" ? 11 : 8}
                />
                <button
                  type="button"
                  className={styles.apiBtn}
                  onClick={onSearchApi}
                  disabled={isSearching || formData.numeroDocumento.length < 8}
                >
                  {isSearching ? (
                    <Loader2 className={styles.spinIcon} size={18} />
                  ) : (
                    <Search size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroupWide}>
              <label className={styles.label}>Nombres o Razón Social</label>
              <Input
                name="nombreRazonSocial"
                value={formData.nombreRazonSocial}
                onChange={onChange}
              />
            </div>

            <div className={styles.formGroupWide}>
              <label className={styles.label}>Dirección Fiscal</label>
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={onChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={onChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <Input name="email" value={formData.email} onChange={onChange} />
            </div>
          </form>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
          {/* CONECTADO AL EVENTO ONSUBMIT */}
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onSubmit}
          >
            {mode === "add" ? "Guardar Cliente" : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
};
