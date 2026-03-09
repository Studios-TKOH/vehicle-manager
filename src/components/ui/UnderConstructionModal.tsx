import React from "react";
import { HardHat } from "lucide-react";
import styles from "../../styles/modules/main-layout.module.css";

interface Props {
  isOpen: boolean;
  moduleName: string;
  onClose: () => void;
}

export const UnderConstructionModal: React.FC<Props> = ({
  isOpen,
  moduleName,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.constructionIconWrapper}>
          <HardHat className={styles.modalIcon} />
        </div>
        <h3 className={styles.modalTitle}>¡Próximamente!</h3>
        <p className={styles.modalText}>
          El módulo de <strong>{moduleName}</strong> se encuentra actualmente en
          desarrollo y estará disponible en una futura actualización.
        </p>
        <div className={styles.modalActionRow}>
          <button className={styles.btnPrimaryInfo} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
