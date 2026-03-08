import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import type { DocumentSeriesEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  seriesItem: DocumentSeriesEntity | null;
}

export const SeriesDeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  seriesItem,
}) => {
  if (!isOpen || !seriesItem) return null;

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
          <h3 className={styles.deleteTitle}>¿Desactivar Serie?</h3>
          <p className={styles.deleteText}>
            Estás a punto de eliminar la serie{" "}
            <span className={styles.deleteHighlight}>{seriesItem.series}</span>.
            No podrá ser utilizada para emitir nuevos comprobantes electrónicos.
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
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
