import React from "react";
import { AlertCircle } from "lucide-react";
import styles from "../../styles/modules/main-layout.module.css";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalIconWrapper}>
          <AlertCircle className={styles.modalIcon} />
        </div>
        <h3 className={styles.modalTitle}>¿Cerrar Sesión?</h3>
        <p className={styles.modalText}>
          Estás a punto de salir del sistema. Si tienes transacciones offline
          pendientes de sincronizar, se guardarán de forma segura en este
          dispositivo.
        </p>
        <div className={styles.modalActionRow}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Mantener Sesión
          </button>
          <button className={styles.btnLogoutConfirm} onClick={onConfirm}>
            Sí, Salir
          </button>
        </div>
      </div>
    </div>
  );
};
