import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "../../styles/modules/vehicles.module.css";

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
          <div className="text-center pt-6 pb-2">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
              ¿Eliminar Vehículo?
            </h3>
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">
              Estás a punto de eliminar el vehículo con placa{" "}
              <strong className="text-slate-900 bg-slate-100 px-2 py-1 rounded mx-1">
                {vehicle.placa}
              </strong>
              . Esta acción lo ocultará del sistema.
            </p>
            <div className="flex justify-center gap-4">
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
