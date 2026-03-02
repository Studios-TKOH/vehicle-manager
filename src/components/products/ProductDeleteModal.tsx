import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/Products.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export const ProductDeleteModal = ({ isOpen, onClose, product }: Props) => {
    if (!isOpen || !product) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${styles.modalContentSmall} !rounded-[2.5rem]`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.deleteModalBody}>
                    <div className={styles.deleteIconWrapper}>
                        <AlertTriangle className={styles.deleteIcon} />
                    </div>
                    <h3 className={styles.deleteTitle}>¿Eliminar Producto?</h3>
                    <p className={styles.deleteText}>
                        Estás por eliminar <span className={styles.deleteHighlight}>{product.nombre}</span>.
                        Esta acción impedirá que se use en nuevas ventas, aunque se mantendrá en el historial previo.
                    </p>
                    <div className={styles.deleteActionRow}>
                        <button className={styles.btnSecondary} onClick={onClose}>CANCELAR</button>
                        <button className={styles.btnDanger} onClick={onClose}>SÍ, ELIMINAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
};