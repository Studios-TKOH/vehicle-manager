import React from "react";
import { X, Truck, Wrench, RotateCcw, Plus } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";

interface VehicleDetailsModalProps {
  vehicle: any;
  onClose: () => void;
  onEmitFactura: (vehicle: any, pastSale?: any) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onEmitFactura,
}) => {
  if (!vehicle) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentLarge}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>{vehicle.placa}</span>
              <span className={styles.modalTitleSubtext}>
                Expediente del Vehículo
              </span>
            </div>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoCardLabel}>
                Empresa / Propietario
              </span>
              <p className={styles.infoCardValue}>{vehicle.clienteNombre}</p>
              <div className={styles.infoCardBadgeGroup}>
                <span className={styles.infoCardBadge}>
                  Doc: {vehicle.clienteDocumento || "No registrado"}
                </span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <span className={styles.infoCardLabel}>Características</span>
              <p className={styles.infoCardValue}>
                {vehicle.marca} {vehicle.modelo}
              </p>
              <div className={styles.infoCardBadgeGroup}>
                <span className={styles.infoCardBadge}>
                  Año: {vehicle.anio}
                </span>
                <span className={styles.infoCardBadge}>
                  Color: {vehicle.color || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.historyHeader}>
            <h3 className={styles.historyTitle}>
              <Wrench className="w-7 h-7 text-slate-400" /> Historial de
              Servicios
            </h3>
          </div>

          {vehicle.historial && vehicle.historial.length > 0 ? (
            <div className={styles.historyList}>
              {vehicle.historial.map((sale: any) => (
                <div key={sale.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <div>
                      <span className={styles.historyCardType}>
                        {sale.tipoComprobante}: {sale.serie}-{sale.correlativo}
                      </span>
                      <span className={styles.historyCardDate}>
                        {new Date(sale.fechaEmision).toLocaleDateString(
                          "es-PE",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </span>
                    </div>
                    <span className={styles.historyCardTotal}>
                      S/ {sale.total.toFixed(2)}
                    </span>
                  </div>

                  <div className={styles.historyCardBody}>
                    <span className={styles.historyCardSectionTitle}>
                      Productos / Servicios realizados:
                    </span>

                    <ul className={styles.historyProductList}>
                      {sale.items.map((item: any) => (
                        <li key={item.id} className={styles.historyProductItem}>
                          <span className={styles.historyProductQty}>
                            {item.cantidad}x
                          </span>
                          <span className={styles.historyProductDesc}>
                            {item.productName}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.historyKmBox}>
                      <div className={styles.historyKmItem}>
                        <span className={styles.historyKmLabel}>
                          KM Ingreso
                        </span>
                        <p className={styles.historyKmValue}>
                          {sale.kilometrajeIngreso.toLocaleString()} km
                        </p>
                      </div>
                      <div className={styles.historyKmDivider}></div>
                      <div className={styles.historyKmItem}>
                        <span className={styles.historyKmLabel}>
                          Próximo Cambio
                        </span>
                        <p className={styles.historyKmValue}>
                          {sale.proximoCambioKm.toLocaleString()} km
                        </p>
                      </div>
                    </div>

                    <div className={styles.historyCardActionRow}>
                      <button
                        onClick={() => onEmitFactura(vehicle, sale)}
                        className={styles.btnRepeatService}
                      >
                        <RotateCcw className="w-6 h-6" /> Repetir este servicio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.historyEmptyState}>
              <Wrench className="mb-6 w-20 h-20 text-slate-300" />
              <p className={styles.historyEmptyText}>
                No hay servicios registrados para este vehículo.
              </p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Cerrar Ventana
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => onEmitFactura(vehicle)}
          >
            <Plus className="w-6 h-6" /> Nueva Venta en Blanco
          </button>
        </div>
      </div>
    </div>
  );
};
