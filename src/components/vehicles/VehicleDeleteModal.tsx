import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";

interface VehicleDeleteModalProps {
  vehicle: any;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const VehicleDeleteModal: React.FC<VehicleDeleteModalProps> = ({
  vehicle,
  onClose,
  onConfirm,
}) => {
  if (!vehicle) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentSmall}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalBody}>
          <div className={styles.deleteModalBody}>
            <div className={styles.deleteIconWrapper}>
              <AlertTriangle className={styles.deleteIcon} />
            </div>
            <h3 className={styles.deleteTitle}>¿Eliminar Vehículo?</h3>
            <p className={styles.deleteText}>
              Estás a punto de eliminar el vehículo con placa{" "}
              <strong className={styles.deleteHighlight}>
                {vehicle.placa}
              </strong>
              . Esta acción lo ocultará del sistema.
            </p>
            <div className={styles.deleteActionRow}>
              <button className={styles.btnSecondary} onClick={onClose}>
                Cancelar
              </button>
              <button
                className={styles.btnDanger}
                onClick={() => onConfirm(vehicle.id)}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
