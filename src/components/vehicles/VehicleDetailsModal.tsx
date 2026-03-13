import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Truck,
  Wrench,
  RotateCcw,
  Plus,
  ClipboardList,
  Search as SearchIcon,
  Trash2,
  Save,
  Check,
} from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";
import type { ProductEntity } from "@data/LocalDB";

interface VehicleDetailsModalProps {
  vehicle: any;
  productsList: ProductEntity[];
  isOpen: boolean;
  onClose: () => void;
  onEmitFactura: (
    vehicle: any,
    pastSale?: any,
    useUsualProducts?: boolean,
  ) => void;
  onSavePreferences: (vehicleId: string, items: any[]) => Promise<void>;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  productsList,
  isOpen,
  onClose,
  onEmitFactura,
  onSavePreferences,
}) => {
  const [preferences, setPreferences] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && vehicle) {
      setPreferences(
        vehicle.productosHabituales ? [...vehicle.productosHabituales] : [],
      );
      setSearchQuery("");
      setShowMenu(false);
      setSaveSuccess(false);
    }
  }, [isOpen, vehicle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !vehicle) return null;

  const filteredProducts = productsList.filter((p) => {
    if (!searchQuery) return false;
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term)
    );
  });

  const handleSelectProduct = (product: ProductEntity) => {
    if (!preferences.some((item) => item.productId === product.id)) {
      setPreferences((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          quantity: 1,
          price: product.price,
          notes: "",
        },
      ]);
    }
    setSearchQuery("");
    setShowMenu(false);
  };

  const handlePrefChange = (productId: string, field: string, value: any) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleRemovePref = (productId: string) => {
    setPreferences((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const handleSaveFicha = async () => {
    setIsSavingPref(true);
    await onSavePreferences(vehicle.id, preferences);
    setIsSavingPref(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.modalContentLarge} ${styles.detailsModalContent}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              <Truck className={styles.iconLarge} />
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>
                {vehicle.licensePlate}
              </span>
              <span className={styles.modalTitleSubtext}>
                Expediente Completo del Vehículo
              </span>
            </div>
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className={styles.iconLarge} />
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
                  KM Act: {(vehicle.kmActual || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailsUsualProductsSection}>
            <div className={styles.detailsUsualProductsHeader}>
              <h3 className={styles.detailsUsualProductsTitle}>
                <ClipboardList
                  className={styles.detailsUsualProductsTitleIcon}
                />{" "}
                Ficha Técnica y Preferencias
              </h3>
            </div>

            <div className={styles.detailsAutocompleteWrapper} ref={menuRef}>
              <div className={styles.detailsAutocompleteInputContainer}>
                <SearchIcon className={styles.detailsAutocompleteIcon} />
                <input
                  type="text"
                  className={styles.detailsAutocompleteInput}
                  placeholder="Buscar producto o servicio para añadir a la ficha..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowMenu(true);
                  }}
                  onFocus={() => setShowMenu(true)}
                />
              </div>

              {showMenu && searchQuery.length > 0 && (
                <div className={styles.detailsAutocompleteMenu}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className={styles.detailsAutocompleteItem}
                        onClick={() => handleSelectProduct(p)}
                      >
                        <div className={styles.detailsAutocompleteItemName}>
                          {p.name}
                        </div>
                        <div className={styles.detailsAutocompleteItemDoc}>
                          Cód: {p.code} | S/ {p.price.toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.detailsAutocompleteEmpty}>
                      No se encontraron productos.
                    </div>
                  )}
                </div>
              )}
            </div>

            {preferences.length > 0 ? (
              <div className={styles.detailsUsualProductsList}>
                {preferences.map((item) => (
                  <div
                    key={item.productId}
                    className={styles.detailsUsualProductItem}
                  >
                    <div className={styles.detailsUsualProductInfo}>
                      <input
                        type="text"
                        className={styles.detailsUsualProductInputName}
                        value={item.productName}
                        onChange={(e) =>
                          handlePrefChange(
                            item.productId,
                            "productName",
                            e.target.value,
                          )
                        }
                        title="Haz clic para editar el nombre específico de este servicio/producto"
                      />
                      <span className={styles.detailsUsualProductSku}>
                        SKU: {item.productCode}
                      </span>
                    </div>

                    <div className={styles.detailsUsualProductControls}>
                      <div className={styles.detailsUsualProductInputGroup}>
                        <label className={styles.detailsUsualProductInputLabel}>
                          Cant.
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          className={styles.detailsUsualProductInputQty}
                          value={item.quantity}
                          onChange={(e) =>
                            handlePrefChange(
                              item.productId,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className={styles.detailsUsualProductInputGroup}>
                        <label className={styles.detailsUsualProductInputLabel}>
                          Precio Unit.
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          className={styles.detailsUsualProductInputPrice}
                          value={item.price}
                          onChange={(e) =>
                            handlePrefChange(
                              item.productId,
                              "price",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div
                        className={styles.detailsUsualProductInputNotesGroup}
                      >
                        <label className={styles.detailsUsualProductInputLabel}>
                          Nota Opcional
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Aceite 5W30"
                          className={styles.detailsUsualProductInputNotes}
                          value={item.notes}
                          onChange={(e) =>
                            handlePrefChange(
                              item.productId,
                              "notes",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div
                        className={styles.detailsUsualProductDeleteBtnWrapper}
                      >
                        <button
                          type="button"
                          onClick={() => handleRemovePref(item.productId)}
                          className={styles.detailsUsualProductDeleteBtn}
                          title="Quitar"
                        >
                          <Trash2 className={styles.iconMedium} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className={styles.detailsUsualProductsSaveRow}>
                  <button
                    onClick={handleSaveFicha}
                    disabled={isSavingPref}
                    className={`${styles.detailsUsualProductsSaveBtn} ${saveSuccess ? styles.detailsUsualProductsSaveBtnSuccess : styles.detailsUsualProductsSaveBtnNormal}`}
                  >
                    {isSavingPref ? (
                      "Guardando..."
                    ) : saveSuccess ? (
                      <>
                        <Check className={styles.iconSmall} /> ¡Ficha Guardada!
                      </>
                    ) : (
                      <>
                        <Save className={styles.iconSmall} /> Guardar Ficha
                        Técnica
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.detailsUsualProductsEmptyState}>
                Utiliza el buscador de arriba para añadir productos habituales a
                la ficha de este vehículo.
              </p>
            )}
          </div>

          <div
            className={`${styles.historyHeader} ${styles.detailsHistorySection}`}
          >
            <h3 className={styles.historyTitle}>
              <Wrench className={styles.historyTitleIcon} /> Historial Completo
              de Servicios
            </h3>
          </div>

          {vehicle.historial && vehicle.historial.length > 0 ? (
            <div className={styles.detailsHistoryList}>
              {vehicle.historial.map((sale: any) => (
                <div key={sale.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <div className={styles.detailsHistoryCardDateWrapper}>
                      <span className={styles.detailsHistoryCardType}>
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
                        <RotateCcw className={styles.iconLarge} /> Repetir este
                        servicio
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

          {preferences && preferences.length > 0 && (
            <button
              className={styles.btnPrimaryAmber}
              onClick={() => onEmitFactura(vehicle, null, true)}
            >
              <ClipboardList className={styles.iconLarge} /> Facturar Ficha
              Técnica
            </button>
          )}

          <button
            className={styles.btnPrimary}
            onClick={() => onEmitFactura(vehicle)}
          >
            <Plus className={styles.iconLarge} /> Nueva Venta en Blanco
          </button>
        </div>
      </div>
    </div>
  );
};
