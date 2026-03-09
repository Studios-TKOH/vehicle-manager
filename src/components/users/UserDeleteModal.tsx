import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { UserEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userItem: UserEntity | null;
}

export const UserDeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  userItem,
}) => {
  if (!isOpen || !userItem) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentSmall}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteModalBody}>
          <div className={styles.deleteIconWrapper}>
            <AlertTriangle size={40} />
          </div>
          <h3 className={styles.deleteTitle}>¿Desactivar Usuario?</h3>
          <p className={styles.deleteText}>
            Estás a punto de revocar el acceso al usuario{" "}
            <span className={styles.deleteHighlight}>{userItem.nombre}</span>.
            No podrá iniciar sesión en la plataforma.
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
              Cancelar
            </button>
            <button className={styles.btnDanger} onClick={onConfirm}>
              Sí, Desactivar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
