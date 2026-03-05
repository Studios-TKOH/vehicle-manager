import React from "react";
import { X, Truck, Wrench, RotateCcw, Plus, ClipboardList } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";

interface VehicleDetailsModalProps {
  vehicle: any;
  isOpen: boolean;
  onClose: () => void;
  onEmitFactura: (
    vehicle: any,
    pastSale?: any,
    useUsualProducts?: boolean,
  ) => void;
  onOpenUsualProducts: () => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onEmitFactura,
  onOpenUsualProducts,
}) => {
  if (!isOpen || !vehicle) return null;

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
              <span className={styles.modalTitleText}>
                {vehicle.licensePlate}
              </span>
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
                {vehicle.brand || "Sin Marca"} {vehicle.model || "Sin Modelo"}
              </p>
              <div className={styles.infoCardBadgeGroup}>
                <span className={styles.infoCardBadge}>
                  Año: {vehicle.year || "N/A"}
                </span>
                <span className={styles.infoCardBadge}>
                  KM: {(vehicle.kmActual || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.usualProductsHeader}>
            <h3 className={styles.historyTitle}>
              <ClipboardList className={styles.historyTitleIcon} /> Preferencias
              y Notas del Cliente
            </h3>
          </div>

          <div className={styles.usualProductsContainer}>
            {vehicle.productosHabituales &&
            vehicle.productosHabituales.length > 0 ? (
              <ul className={styles.usualProductsListModal}>
                {vehicle.productosHabituales.map((pref: any, idx: number) => (
                  <li key={idx} className={styles.usualProductsListItem}>
                    <span className={styles.usualProductsItemName}>
                      {pref.productName}
                    </span>
                    {pref.notes && (
                      <span className={styles.usualProductsItemNotes}>
                        "{pref.notes}"
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.usualProductsEmptyTextAlt}>
                No hay preferencias o productos habituales registrados para este
                vehículo.
              </p>
            )}

            <div className={styles.usualProductsActionRow}>
              <button
                onClick={onOpenUsualProducts}
                className={styles.btnManageUsualProducts}
              >
                <Plus size={14} /> Gestionar Preferencias
              </button>
            </div>
          </div>

          <div className={styles.historyHeader}>
            <h3 className={styles.historyTitle}>
              <Wrench className={styles.historyTitleIcon} /> Historial de
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
                        {sale.status === "CONFIRMED"
                          ? "COMPROBANTE"
                          : "Borrador / Otro"}
                      </span>
                      <span className={styles.historyCardDate}>
                        {new Date(sale.issueDate).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span className={styles.historyCardTotal}>
                      S/{" "}
                      {sale.totalAmount ? sale.totalAmount.toFixed(2) : "0.00"}
                    </span>
                  </div>

                  <div className={styles.historyCardBody}>
                    <span className={styles.historyCardSectionTitle}>
                      Productos / Servicios realizados:
                    </span>

                    <ul className={styles.historyProductList}>
                      {sale.items &&
                        sale.items.map((item: any) => (
                          <li
                            key={item.id}
                            className={styles.historyProductItem}
                          >
                            <span className={styles.historyProductQty}>
                              {item.quantity}x
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
                          {(sale.currentMileage || 0).toLocaleString()} km
                        </p>
                      </div>
                      <div className={styles.historyKmDivider}></div>
                      <div className={styles.historyKmItem}>
                        <span className={styles.historyKmLabel}>
                          Próximo Cambio
                        </span>
                        <p className={styles.historyKmValue}>
                          {(sale.nextMaintenanceMileage || 0).toLocaleString()}{" "}
                          km
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
              <Wrench className={styles.historyEmptyIconLarge} />
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

          {vehicle.productosHabituales &&
            vehicle.productosHabituales.length > 0 && (
              <button
                className={styles.btnPrimaryAmber}
                onClick={() => onEmitFactura(vehicle, null, true)}
              >
                <ClipboardList className="w-5 h-5" /> Facturar Ficha Técnica
              </button>
            )}

          <button
            className={styles.btnPrimary}
            onClick={() => onEmitFactura(vehicle)}
          >
            <Plus className="w-5 h-5" /> Nueva Venta en Blanco
          </button>
        </div>
      </div>
    </div>
  );
};
