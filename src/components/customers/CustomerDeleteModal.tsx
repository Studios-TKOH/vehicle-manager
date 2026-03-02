import { AlertTriangle, X } from "lucide-react";
import styles from "@styles/modules/Customers.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customer: any;
}

export const CustomerDeleteModal = ({ isOpen, onClose, onConfirm, customer }: Props) => {
    if (!isOpen || !customer) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${styles.modalContentSmall} !rounded-[2.5rem]`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.deleteModalBody}>
                    {/* Icono de advertencia estilizado */}
                    <div className={styles.deleteIconWrapper}>
                        <AlertTriangle className={styles.deleteIcon} />
                    </div>

                    <h3 className={styles.deleteTitle}>¿Eliminar Cliente?</h3>

                    <p className={styles.deleteText}>
                        Estás a punto de eliminar a
                        <span className={styles.deleteHighlight}>{customer.nombreRazonSocial}</span>.
                        Esta acción no se puede deshacer y el cliente desaparecerá del directorio.
                    </p>

                    <div className={styles.deleteActionRow}>
                        <button className={styles.btnSecondary} onClick={onClose}>
                            CANCELAR
                        </button>
                        <button className={styles.btnDanger} onClick={onConfirm}>
                            SÍ, ELIMINAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};