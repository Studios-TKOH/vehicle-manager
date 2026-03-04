import { AlertTriangle } from "lucide-react";
import styles from "@styles/modules/products.module.css";
import type { ProductEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: ProductEntity | null;
}

export const ProductDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}: Props) => {
  if (!isOpen || !product) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.deleteModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.deleteModalBody}>
          <div className={styles.deleteIconWrapper}>
            <AlertTriangle className={styles.deleteIcon} />
          </div>
          <h3 className={styles.deleteTitle}>¿Eliminar Producto?</h3>
          <p className={styles.deleteText}>
            Estás por eliminar{" "}
            <span className={styles.deleteHighlight}>{product.name}</span>. Esta
            acción impedirá que se use en nuevas ventas, aunque se mantendrá en
            el historial previo.
          </p>
          <div className={styles.deleteActionRow}>
            <button className={styles.btnSecondary} onClick={onClose}>
              CANCELAR
            </button>
            {/* Conectamos el botón rojo al evento onConfirm */}
            <button className={styles.btnDanger} onClick={onConfirm}>
              SÍ, ELIMINAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
