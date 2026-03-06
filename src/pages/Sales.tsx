import { useState } from "react";
import { useSales } from "@hooks/useSales";
import {
  PackageSearch,
  FileText,
  Menu as MenuIcon,
  Trash2,
  Plus,
  Minus,
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
import styles from "@styles/modules/sales.module.css";
import { SaleErrorModal } from "@components/sales/SaleErrorModal";

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
    processSale,
    saleError,
    setSaleError
  } = useSales();

  const [customerSearch, setCustomerSearch] = useState("");
  const [successData, setSuccessData] = useState<SaleSuccessData | null>(null);

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

  const handleProcessSale = async () => {
    const saleResult = await processSale();

    if (saleResult) {
      setSuccessData({
        docType: saleResult.docType,
        series: saleResult.series,
        correlativeNumber: saleResult.correlativeNumber,
        customerName: saleResult.customerName,
        totalAmount: saleResult.totalAmount,
      });
    }
  };

  const handleNewSale = () => {
    window.location.reload();
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
            <Autocomplete
              placeholder="Escribe para buscar un cliente..."
              searchValue={customerSearch}
              onSearchChange={setCustomerSearch}
              selectedItem={selectedCustomer}
              options={filteredCustomers}
              getDisplayValue={(c) => c.name}
              onSelect={(c) => setSelectedCustomer(c)}
              onClear={() => {
                setSelectedCustomer(null);
                setCustomerSearch("");
              }}
              renderOption={(c) => (
                <>
                  <div className={styles.autocompleteItemName}>{c.name}</div>
                  <div className={styles.autocompleteItemDoc}>
                    {c.identityDocType === "6" ? "RUC" : "DNI"}:{" "}
                    {c.identityDocNumber}
                  </div>
                </>
              )}
            />
          </FormField>

          <FormField label="Fecha de emisión">
            <Input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              readOnly
            />
          </FormField>

          <FormField label="Fecha de vencimiento">
            <Input type="date" />
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
            <Input type="number" placeholder="0.00" />
          </FormField>
        </div>

        {/* FILA 3: EXTRAS DEL VEHÍCULO */}
        <div className={styles.actionRowGrid}>
          <InlineActionButton
            label="PLACA"
            value={extras.placa?.toString() || ""}
            isEditing={inlineInputs.placa}
            onToggle={() => toggleInlineInput("placa")}
            onBlur={() => blurInlineInput("placa")}
            onChange={(val) => handleExtraChange("placa", val)}
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

          <Button variant="primary" className={styles.btnOtros} fullWidth>
            OTROS <MenuIcon className={styles.btnOtrosIcon} />
          </Button>
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
                <th className={styles.thAction}></th>
              </tr>
            </thead>
            <tbody className={styles.cartTableBody}>
              {cart.map((item) => (
                <tr key={item.tempId} className={styles.cartTableRow}>
                  <td className={styles.tdBase}>
                    <span className={styles.cartItemName}>
                      {item.name || (item as any).nombre}
                    </span>
                    {item.notaItem && (
                      <span className={styles.cartItemNote}>
                        Nota: {item.notaItem}
                      </span>
                    )}
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
                    <button
                      onClick={() => removeItem(item.tempId)}
                      className={styles.btnRemoveItem}
                      title="Eliminar línea"
                    >
                      <Trash2 size={16} />
                    </button>
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

      {/* MODAL DE ÉXITO */}
      <SaleSuccessModal
        isOpen={!!successData}
        saleData={successData}
        onNewSale={handleNewSale}
        onPrintTicket={() => alert("Simulando impresión...")}
        onDownloadPdf={() => alert("Simulando PDF...")}
      />

      {/* NUEVO: MODAL DE ERROR */}
      <SaleErrorModal
        isOpen={!!saleError}
        errorMessage={saleError}
        onClose={() => setSaleError(null)}
      />
    </div>
  );
};
