import { X, Building2, User, MapPin, Phone, Mail, Truck } from "lucide-react";
import styles from "@styles/modules/customers.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export const CustomerDetailsModal = ({ isOpen, onClose, customer }: Props) => {
  if (!isOpen || !customer) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentLarge}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              {/* Verificamos el código SUNAT: '6' es RUC, '1' es DNI */}
              {customer.identityDocType === "6" ? (
                <Building2 size={28} className={styles.modalTitleIcon} />
              ) : (
                <User size={28} className={styles.modalTitleIcon} />
              )}
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>Expediente</span>
              <span className={styles.modalTitleSubtext}>
                Ficha Maestra del Cliente
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
              <span className={styles.infoCardLabel}>
                Identidad y Razón Social
              </span>
              <div className={styles.infoCardValue}>{customer.name}</div>
              <div className={styles.infoCardBadgeGroup}>
                <span className={styles.infoCardBadge}>
                  {customer.identityDocType === "6" ? "RUC" : "DNI"}:{" "}
                  {customer.identityDocNumber}
                </span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoCardLabel}>
                Información de Contacto
              </span>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconBox}>
                    <Phone size={18} />
                  </div>
                  <span className={styles.contactTextStrong}>
                    {customer.phone || "---"}
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconBox}>
                    <Mail size={18} />
                  </div>
                  <span className={styles.contactTextLight}>
                    {customer.email || "---"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reemplazamos el 'style' inline por la nueva clase .infoCardWide */}
          <div className={styles.infoCardWide}>
            <span className={styles.infoCardLabel}>
              Ubicación / Dirección Fiscal
            </span>
            <div className={styles.addressWrapper}>
              <div className={styles.addressIconBox}>
                <MapPin size={24} />
              </div>
              <p className={styles.addressText}>
                {customer.address || "No registrada"}
              </p>
            </div>
          </div>

          <div className={styles.historyHeader}>
            <h3 className={styles.historyTitle}>
              <Truck className={styles.modalTitleIcon} /> Flota de Vehículos
            </h3>
          </div>

          <div className={styles.historyList}>
            {[
              ...(customer.vehiculosPropios || []),
              ...(customer.vehiculosConducidos || []),
            ].length > 0 ? (
              [
                ...(customer.vehiculosPropios || []),
                ...(customer.vehiculosConducidos || []),
              ].map((v: any, idx: number) => (
                <div key={idx} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <div className={styles.historyCardTypeWrapper}>
                      <span className={styles.historyCardType}>
                        {v.licensePlate}
                      </span>
                      <span className={styles.historyCardDate}>
                        {v.brand} {v.model}
                      </span>
                    </div>
                    <span className={styles.historyCardTotal}>
                      {/* Evaluamos si el vehículo es propio o conducido */}
                      {v.customerId === customer.id ? "PROPIO" : "CONDUCTOR"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.historyEmptyState}>
                <Truck size={48} className={styles.historyEmptyIconLarge} />
                <p className={styles.historyEmptyText}>
                  No hay vehículos vinculados.
                </p>
              </div>
            )}
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
