import { X, Tag, Barcode } from "lucide-react";
import styles from "@styles/modules/products.module.css";
import type { ProductEntity } from "@data/LocalDB";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: ProductEntity | any;
}

export const ProductDetailsModal = ({ isOpen, onClose, product }: Props) => {
  if (!isOpen || !product) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentLarge}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              <Tag size={28} className={styles.modalTitleIcon} />
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>Expediente</span>
              <span className={styles.modalTitleSubtext}>
                Ficha Técnica de Producto
              </span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoCardLabel}>Nombre del Producto</span>
              <div className={styles.infoCardValue}>{product.name}</div>
              <div className={styles.infoCardBadgeGroup}>
                <span className={styles.infoCardBadge}>
                  {product.category || "General"}
                </span>
                <span className={styles.unitBadge}>{product.unitType}</span>
              </div>
            </div>

            <div className={styles.barcodeCard}>
              <Barcode size={48} className={styles.barcodeIconLarge} />
              <span className={styles.infoCardLabel}>
                Código de Barras / SKU
              </span>
              <div className={styles.barcodeText}>{product.code}</div>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCardBlue}>
              <span className={styles.metricLabelBlue}>
                Precio de Venta (IGV Inc.)
              </span>
              <div className={styles.metricValueBlue}>
                S/ {Number(product.price || 0).toFixed(2)}
              </div>
              <p className={styles.metricSubBlue}>
                {/* Usamos taxType o afectacionIgv dependiendo de cómo lo mandes al form final */}
                Afectación:{" "}
                {product.taxType === "10" || product.afectacionIgv === "10"
                  ? "Gravado - Operación Onerosa"
                  : "Exonerado"}
              </p>
            </div>

            <div className={styles.metricCardOrange}>
              <span className={styles.metricLabelOrange}>
                Frecuencia de Mantenimiento
              </span>
              <div className={styles.metricValueOrange}>
                {/* Mapeamos a maintenanceIntervalKm que usamos en la vista de Productos */}
                {product.maintenanceIntervalKm || product.frecuenciaCambioKm
                  ? `${(product.maintenanceIntervalKm || product.frecuenciaCambioKm).toLocaleString()} KM`
                  : "N/A"}
              </div>
              <p className={styles.metricSubOrange}>
                Indicador para alertas de servicio técnico
              </p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
