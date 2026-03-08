import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBranches: () => void; // Para llevarlo al Tab de Sucursales
}

export const NoBranchWarningModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToBranches,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentSmall}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteModalBody}>
          <div className={styles.warningIconWrapper}>
            <AlertTriangle size={48} strokeWidth={2} />
          </div>
          <h3 className={styles.deleteTitle}>Requiere Sucursal</h3>
          <p className={styles.deleteText}>
            No puedes registrar una serie de facturación porque tu empresa aún
            no tiene
            <span className={styles.deleteHighlight}>
              {" "}
              establecimientos / sucursales{" "}
            </span>{" "}
            registrados.
          </p>
          <div
            className={styles.formGrid}
            style={{ width: "100%", gap: "0.75rem" }}
          >
            <button
              className={styles.btnSecondary}
              onClick={onClose}
              style={{ marginTop: 0 }}
            >
              Cerrar
            </button>
            <button
              className={styles.btnWarning}
              onClick={onNavigateToBranches}
              style={{ marginTop: 0 }}
            >
              Crear Sucursal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
