import React from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";

interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

export const SettingsSuccessModal: React.FC<Props> = ({
  isOpen,
  title = "¡Guardado Exitosamente!",
  message = "Los cambios han sido guardados y se sincronizarán con la nube en breve.",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentSmall}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.feedbackModalBody}>
          <div className={styles.successIconWrapper}>
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          {/* Reutilizamos las clases de texto del modal de eliminación porque tienen la misma jerarquía visual */}
          <h3 className={styles.deleteTitle}>{title}</h3>
          <p className={styles.deleteText}>{message}</p>
          <button className={styles.btnSuccess} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
