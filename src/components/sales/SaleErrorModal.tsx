import React from "react";
import { AlertCircle } from "lucide-react";
import styles from "@styles/modules/sales.module.css";

interface SaleErrorModalProps {
  isOpen: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export const SaleErrorModal: React.FC<SaleErrorModalProps> = ({
  isOpen,
  errorMessage,
  onClose,
}) => {
  if (!isOpen || !errorMessage) return null;

  return (
    <div className={styles.errorModalOverlay} onClick={onClose}>
      <div
        className={styles.errorModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (Rojo Error) */}
        <div className={styles.errorHeader}>
          <div className={styles.errorIconBox}>
            <AlertCircle size={40} strokeWidth={2.5} />
          </div>
          <h2 className={styles.errorTitle}>Aviso de Validación</h2>
        </div>

        {/* BODY (Mensaje) */}
        <div className={styles.errorBody}>
          <p className={styles.errorMessageText}>{errorMessage}</p>

          {/* ACTIONS */}
          <div className={styles.errorActions}>
            <button className={styles.btnActionError} onClick={onClose}>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
