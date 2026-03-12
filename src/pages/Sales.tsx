import { useState, useRef, useEffect } from "react";
import { useSales, type CartItem } from "@hooks/useSales";
import {
  PackageSearch,
  FileText,
  Menu as MenuIcon,
  Trash2,
  Plus,
  Minus,
  Search,
  Loader2,
  Edit2,
} from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";
import { FormField } from "@components/ui/FormField";
import { Autocomplete } from "@components/ui/Autocomplete";
import { InlineActionButton } from "@components/sales/InlineActionButton";
import {
  SaleSuccessModal,
  type SaleSuccessData,
} from "@components/sales/SaleSuccessModal";
import { SaleErrorModal } from "@components/sales/SaleErrorModal";
import { EditCartItemModal } from "@components/sales/EditCartItemModal";
import styles from "@styles/modules/sales.module.css";

export const Sales = () => {
  const {
    customers,
    products,
    docType,
    setDocType,
    selectedSeries,
    selectedCustomer,
    setSelectedCustomer,
    extras,
    handleExtraChange,
    inlineInputs,
    toggleInlineInput,
    blurInlineInput,
    cart,
    productSearch,
    setProductSearch,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    updateItemDetails,
    processSale,
    saleError,
    setSaleError,
    isSearchingApi,
    handleSearchApiCustomer,
    issueDate,
    setIssueDate,
    minDate,
    maxDate,
    globalDiscount,
    setGlobalDiscount,
    resetForm,
    isOtrosMenuOpen,
    setIsOtrosMenuOpen,
  } = useSales();

  const [customerSearch, setCustomerSearch] = useState("");
  const [successData, setSuccessData] = useState<SaleSuccessData | null>(null);

  const [itemToEdit, setItemToEdit] = useState<CartItem | null>(null);

  const otrosMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        otrosMenuRef.current &&
        !otrosMenuRef.current.contains(event.target as Node)
      ) {
        setIsOtrosMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOtrosMenuOpen]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.identityDocNumber.includes(customerSearch),
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(productSearch.toLowerCase())),
  );

  const onSearchApi = async () => {
    const wasFound = await handleSearchApiCustomer(customerSearch);
    if (wasFound) setCustomerSearch("");
  };

  const handleProcessSale = async () => {
    const saleResult = await processSale();

    if (saleResult) {
      setSuccessData({
        docType: saleResult.docType,
        series: saleResult.series,
        correlativeNumber: saleResult.correlativeNumber,
        customerName: saleResult.customerName,
        customerDocument: saleResult.customerDocument,
        totalAmount: saleResult.totalAmount,
        issueDate: saleResult.issueDate,
        sunatStatus: saleResult.sunatStatus,
      });
    }
  };

  const handleNewSale = () => {
    setSuccessData(null);
    resetForm();
  };

  const handlePlateToggle = () => {
    if (!selectedCustomer && docType !== "PR") {
      setSaleError(
        "Para ingresar un vehículo, primero debe seleccionar o registrar un cliente al que le pertenezca.",
      );
      return;
    }
    toggleInlineInput("placa");
  };

  return (
    <div className={styles.salesContainer}>
      <div className={styles.salesScrollableArea}>
        {/* HEADER */}
        <div className={styles.titleGroup}>
          <div className={styles.headerTitleWrapper}>
            <div className={styles.iconWrapperBlue}>
              <FileText className={styles.titleIconBlue} strokeWidth={2} />
            </div>
            <h2 className={styles.pageTitle}>Nueva Venta</h2>
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={docType === "PR"}
              onChange={(e) => setDocType(e.target.checked ? "PR" : "03")}
              className={styles.checkboxInput}
            />
            PROFORMA
          </label>
        </div>

        {/* FILA 1: CLIENTE Y FECHAS */}
        <div className={styles.grid4}>
          <FormField label="Cliente" className={styles.autocompleteContainer}>
            <div className={styles.customerSearchRow}>
              <div className={styles.customerSearchInputWrapper}>
                <Autocomplete
                  placeholder="Escribe Nombre, o digita RUC/DNI..."
                  searchValue={customerSearch}
                  onSearchChange={setCustomerSearch}
                  selectedItem={selectedCustomer}
                  options={filteredCustomers}
                  getDisplayValue={(c) => `${c.identityDocNumber} - ${c.name}`}
                  onSelect={(c) => {
                    setSelectedCustomer(c);
                    setCustomerSearch("");
                  }}
                  onClear={() => {
                    setSelectedCustomer(null);
                    setCustomerSearch("");
                  }}
                  renderOption={(c) => (
                    <>
                      <div className={styles.autocompleteItemName}>
                        {c.name}
                      </div>
                      <div className={styles.autocompleteItemDoc}>
                        {c.identityDocType === "6" ? "RUC" : "DNI"}:{" "}
                        {c.identityDocNumber}
                      </div>
                    </>
                  )}
                />
              </div>

              {!selectedCustomer && (
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.btnApiSearch}
                  onClick={onSearchApi}
                  disabled={
                    isSearchingApi ||
                    (customerSearch.trim().length !== 8 &&
                      customerSearch.trim().length !== 11)
                  }
                  title="Buscar en SUNAT/RENIEC"
                >
                  {isSearchingApi ? (
                    <Loader2 className={styles.apiSearchIconSpin} size={18} />
                  ) : (
                    <Search className={styles.apiSearchIcon} size={18} />
                  )}
                </Button>
              )}
            </div>
          </FormField>

          <FormField label="Fecha de emisión">
            <Input
              type="date"
              value={issueDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setIssueDate(e.target.value)}
              title="Solo puede emitir comprobantes con ±3 días de diferencia a la fecha actual."
            />
          </FormField>

          <FormField label="Fecha de vencimiento">
            <Input type="date" min={issueDate} />
          </FormField>
        </div>

        {/* FILA 2: COMPROBANTE Y DESCUENTOS */}
        <div className={styles.grid4}>
          <FormField label="Tipo de comprobante">
            <Select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              disabled={docType === "PR"}
            >
              {docType === "PR" && (
                <option value="PR">PROFORMA / COTIZACIÓN</option>
              )}
              {docType !== "PR" && (
                <>
                  <option value="03">BOLETA DE VENTA</option>
                  <option value="01">FACTURA ELECTRÓNICA</option>
                </>
              )}
            </Select>
          </FormField>

          <FormField label="Serie y Correlativo">
            <div className={styles.seriesGroup}>
              <Input
                type="text"
                value={selectedSeries?.series || "----"}
                readOnly
                className={styles.seriesInput}
              />
              <Input
                type="text"
                value={
                  selectedSeries
                    ? String(selectedSeries.nextCorrelative).padStart(6, "0")
                    : "000000"
                }
                readOnly
                className={styles.correlativeInput}
              />
            </div>
          </FormField>

          <FormField label="Tipo de operación">
            <Select>
              <option>VENTA INTERNA</option>
            </Select>
          </FormField>

          <FormField label="Dscto. global (%)">
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={globalDiscount === 0 ? "" : globalDiscount}
              onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            />
          </FormField>
        </div>

        {/* FILA 3: EXTRAS DEL VEHÍCULO */}
        <div className={styles.actionRowGrid}>
          <InlineActionButton
            label="PLACA"
            value={extras.placa?.toString() || ""}
            isEditing={inlineInputs.placa}
            onToggle={handlePlateToggle}
            onBlur={() => blurInlineInput("placa")}
            onChange={(val) => handleExtraChange("placa", val.toUpperCase())}
          />

          <InlineActionButton
            label="KM ACTUAL"
            value={extras.kilometrajeActual?.toString() || ""}
            isEditing={inlineInputs.kilometrajeActual}
            onToggle={() => toggleInlineInput("kilometrajeActual")}
            onBlur={() => blurInlineInput("kilometrajeActual")}
            onChange={(val) => handleExtraChange("kilometrajeActual", val)}
          />

          <InlineActionButton
            label="PRÓX. CAMBIO"
            value={extras.proximoCambioKm?.toString() || ""}
            isEditing={inlineInputs.proximoCambioKm}
            onToggle={() => toggleInlineInput("proximoCambioKm")}
            onBlur={() => blurInlineInput("proximoCambioKm")}
            onChange={(val) => handleExtraChange("proximoCambioKm", val)}
          />

          <InlineActionButton
            label="OBSERVACIONES"
            value={extras.observaciones?.toString() || ""}
            isEditing={inlineInputs.observaciones}
            onToggle={() => toggleInlineInput("observaciones")}
            onBlur={() => blurInlineInput("observaciones")}
            onChange={(val) => handleExtraChange("observaciones", val)}
          />

          <div className={styles.otrosMenuContainer} ref={otrosMenuRef}>
            <Button
              variant={isOtrosMenuOpen ? "primary" : "secondary"}
              className={styles.btnOtros}
              fullWidth
              onClick={() => setIsOtrosMenuOpen(!isOtrosMenuOpen)}
            >
              OTROS <MenuIcon className={styles.btnOtrosIcon} />
            </Button>

            <div
              className={
                isOtrosMenuOpen
                  ? styles.otrosDropdown
                  : styles.otrosDropdownHidden
              }
            >
              <div className={styles.otrosDropdownHeader}>
                Datos Adicionales
              </div>

              <div className={styles.otrosInputGroup}>
                <label className={styles.otrosLabel}>Condición de Pago</label>
                <Select
                  value={extras.condicionPago}
                  onChange={(e) =>
                    handleExtraChange("condicionPago", e.target.value)
                  }
                >
                  <option value="CONTADO">CONTADO</option>
                  <option value="CRÉDITO A 15 DÍAS">CRÉDITO 15 DÍAS</option>
                  <option value="CRÉDITO A 30 DÍAS">CRÉDITO 30 DÍAS</option>
                  <option value="YAPE / PLIN">YAPE / PLIN</option>
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                </Select>
              </div>

              <div className={styles.otrosInputGroup}>
                <label className={styles.otrosLabel}>
                  Orden de Compra (Opcional)
                </label>
                <Input
                  placeholder="Ej: OC-2026-001"
                  value={extras.ordenCompra}
                  onChange={(e) =>
                    handleExtraChange("ordenCompra", e.target.value)
                  }
                />
              </div>

              <div className={styles.otrosInputGroup}>
                <label className={styles.otrosLabel}>
                  Guía de Remisión (Opcional)
                </label>
                <Input
                  placeholder="Ej: T001-00045"
                  value={extras.guiaRemision}
                  onChange={(e) =>
                    handleExtraChange("guiaRemision", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONA CENTRAL: CARRITO */}
      <div className={styles.cartArea}>
        {cart.length === 0 ? (
          <div className={styles.cartEmptyState}>
            Busca un producto en la barra inferior para comenzar...
          </div>
        ) : (
          <table className={styles.cartTable}>
            <thead className={styles.cartTableHeader}>
              <tr>
                <th className={styles.thBase}>Producto</th>
                <th className={styles.thCenter}>Precio Unit.</th>
                <th className={styles.thCenter}>Total</th>
                <th className={styles.thQty}>Cantidad</th>
                <th className={styles.thAction}>Acciones</th>
              </tr>
            </thead>
            <tbody className={styles.cartTableBody}>
              {cart.map((item) => (
                <tr key={item.tempId} className={styles.cartTableRow}>
                  <td className={styles.tdBase}>
                    <span className={styles.cartItemName}>
                      {item.name || (item as any).nombre}
                    </span>
                  </td>
                  <td className={styles.cartItemPrice}>
                    S/ {item.price.toFixed(2)}
                  </td>
                  <td className={styles.cartItemTotal}>
                    S/ {(item.price * item.cantidad).toFixed(2)}
                  </td>
                  <td className={styles.tdBase}>
                    <div className={styles.qtyControlGroup}>
                      <button
                        onClick={() =>
                          updateQuantity(item.tempId, item.cantidad - 1)
                        }
                        className={styles.btnQtyControl}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.cantidad}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.tempId, item.cantidad + 1)
                        }
                        className={styles.btnQtyControl}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className={styles.tdCenter}>
                    {/* Grupo de botones de acción */}
                    <div className={styles.actionButtonsGroup}>
                      <button
                        onClick={() => setItemToEdit(item)}
                        className={styles.btnEditProduct}
                        title="Editar Precio/Nombre Temporalmente"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.tempId)}
                        className={styles.btnRemoveItem}
                        title="Eliminar línea"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER FIJO: BÚSQUEDA Y TOTALES */}
      <div className={styles.footerArea}>
        <div className={styles.searchContainer}>
          <Autocomplete
            placeholder="Escriba el nombre o código del producto..."
            searchValue={productSearch}
            onSearchChange={setProductSearch}
            selectedItem={null}
            options={filteredProducts}
            getDisplayValue={(p) => p.name}
            onSelect={(p) => {
              addItem(p as any);
              setProductSearch("");
            }}
            onClear={() => setProductSearch("")}
            icon={<PackageSearch className={styles.titleIconBlue} />}
            inputHeightClass="h-[46px]"
            dropdownPosition="top"
            renderOption={(p) => (
              <div className={styles.autocompleteOptionRow}>
                <div className={styles.autocompleteOptionText}>
                  <div className={styles.autocompleteItemName}>{p.name}</div>
                  <div className={styles.autocompleteItemDoc}>
                    Cód: {p.code}
                  </div>
                </div>
                <div className={styles.autocompleteProductPrice}>
                  S/ {p.price.toFixed(2)}
                </div>
              </div>
            )}
          />
        </div>

        <div className={styles.totalsBox}>
          <div className={styles.totalsTextWrapper}>
            <p className={styles.totalBigText}>
              TOTAL{" "}
              <span className={styles.totalBigTextValue}>
                S/ {totals.total.toFixed(2)}
              </span>
              {globalDiscount > 0 && (
                <span className={styles.discountSign}>
                  (-{globalDiscount}%)
                </span>
              )}
            </p>
            <p className={styles.subtotalsText}>
              Subtotal: S/ {totals.subtotal.toFixed(2)} &nbsp;&bull;&nbsp; IGV:
              S/ {totals.igv.toFixed(2)}
            </p>
          </div>

          <div className={styles.totalsActionWrapper}>
            <Button
              variant="secondary"
              size="xl"
              className={styles.btnTotalsAction}
              onClick={() => alert("Vista PDF en construcción...")}
            >
              VISTA PREVIA
            </Button>
            <Button
              variant="success"
              size="xl"
              className={styles.btnTotalsActionMain}
              onClick={handleProcessSale}
            >
              PROCESAR VENTA
            </Button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <EditCartItemModal
        isOpen={!!itemToEdit}
        item={itemToEdit}
        onClose={() => setItemToEdit(null)}
        onSave={updateItemDetails}
      />

      <SaleSuccessModal
        isOpen={!!successData}
        saleData={successData}
        onNewSale={handleNewSale}
        onPrintTicket={() => alert("Simulando impresión...")}
        onDownloadPdf={() => alert("Simulando PDF...")}
      />

      <SaleErrorModal
        isOpen={!!saleError}
        errorMessage={saleError}
        onClose={() => setSaleError(null)}
      />
    </div>
  );
};
