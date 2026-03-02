import { useState } from "react";
import { useSales } from "@hooks/useSales";
import { db } from "@data/db";
import {
  PackageSearch,
  FileText,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";
import { FormField } from "@components/ui/FormField";
import { Autocomplete } from "@components/ui/Autocomplete";
import { InlineActionButton } from "@components/sales/InlineActionButton";

export const Sales = () => {
  const {
    documento,
    setDocumento,
    extras,
    handleExtraChange,
    inlineInputs,
    toggleInlineInput,
    blurInlineInput,
    cart,
    addItem,
    removeItem,
    updateQuantity,
    productSearch,
    setProductSearch,
    totals,
    productosUsuales,
  } = useSales();

  const [proformaChecked, setProformaChecked] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const [showPlacaModal, setShowPlacaModal] = useState(false);
  const [showOrdenCompraModal, setShowOrdenCompraModal] = useState(false);
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);
  const [showPagosModal, setShowPagosModal] = useState(false);

  const filteredCustomers = db.customers.filter(
    (c) =>
      c.nombreRazonSocial.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.numeroDocumento.includes(customerSearch)
  );

  const filteredProducts = db.products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.codigoBarras?.includes(productSearch)
  );

  return (
    <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-xl w-full h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex flex-col flex-none gap-4 px-6 py-5 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-blue-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" strokeWidth={2} />
            </div>
            <h2 className="m-0 font-semibold text-slate-800 text-2xl">
              Nueva Venta
            </h2>
          </div>
          <label className="flex items-center gap-2 font-bold text-slate-600 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={proformaChecked}
              onChange={(e) => setProformaChecked(e.target.checked)}
              className="border-slate-300 rounded focus:ring-blue-500 w-4 h-4 text-blue-600"
            />
            PROFORMA
          </label>
        </div>

        <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
          <FormField label="Cliente" className="relative col-span-1 md:col-span-2">
            <Autocomplete
              placeholder="Escribe para buscar un cliente..."
              searchValue={customerSearch}
              onSearchChange={setCustomerSearch}
              selectedItem={documento.cliente}
              options={filteredCustomers}
              getDisplayValue={(c) => c.nombreRazonSocial}
              onSelect={(c) => {
                if (setDocumento) setDocumento((prev) => ({ ...prev, cliente: c }));
              }}
              onClear={() => {
                if (setDocumento) setDocumento((prev) => ({ ...prev, cliente: null }));
                setCustomerSearch("");
              }}
              renderOption={(c) => (
                <>
                  <div className="font-bold text-slate-800 text-sm">
                    {c.nombreRazonSocial}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {c.tipoDocumentoIdentidad}: {c.numeroDocumento}
                  </div>
                </>
              )}
            />
          </FormField>

          <FormField label="Fecha de emisión">
            <Input type="date" value={documento.fecha} readOnly />
          </FormField>

          <FormField label="Fecha de vencimiento">
            <Input type="date" />
          </FormField>
        </div>

        <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
          <FormField label="Tipo de comprobante">
            <Select>
              <option>FACTURA ELECTRÓNICA</option>
              <option>BOLETA DE VENTA</option>
            </Select>
          </FormField>

          <FormField label="Serie y Correlativo">
            <div className="flex gap-2">
              <Input
                type="text"
                value={documento.serie}
                readOnly
                className="!px-1 w-1/3 text-center"
              />
              <Input
                type="text"
                value={documento.correlativo}
                readOnly
                className="w-2/3"
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

        <div className="gap-3 grid grid-cols-2 md:grid-cols-5">
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

          <Button variant="primary" className="w-full h-11" fullWidth>
            OTROS <MenuIcon className="ml-1 w-4 h-4" />
          </Button>
        </div>

        {productosUsuales.length > 0 && cart.length === 0 && (
          <div className="flex gap-2 mt-2">
            <span className="mt-1 font-bold text-slate-500 text-xs">
              FRECUENTES:
            </span>
            {productosUsuales.map((p: any) => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                className="bg-blue-50 hover:bg-blue-600 px-3 py-1 border border-blue-100 rounded-md font-bold text-blue-700 hover:text-white text-xs transition-colors"
              >
                + {p.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 bg-slate-50 border-slate-200 border-t border-b overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex justify-center items-center p-10 h-full font-medium text-slate-400 text-sm text-center">
            Busca un producto en la barra inferior para comenzar...
          </div>
        ) : (
          <table className="w-full text-slate-600 text-sm text-left">
            <thead className="top-0 z-10 sticky bg-slate-100 border-slate-200 border-b font-bold text-[10px] text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3 text-center">Precio Unit.</th>
                <th className="px-6 py-3 text-center">Total</th>
                <th className="px-6 py-3 w-32 text-center">Cantidad</th>
                <th className="px-6 py-3 w-20 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cart.map((item) => (
                <tr
                  key={item.tempId}
                  className="bg-white hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-3 font-semibold text-slate-800">
                    {item.nombre}
                  </td>
                  <td className="px-6 py-3 font-medium text-center">
                    S/ {item.precioUnitario.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-800 text-center">
                    S/ {(item.precioUnitario * item.cantidad).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.tempId, item.cantidad - 1)
                        }
                        className="flex justify-center items-center bg-white hover:bg-slate-100 border border-slate-300 rounded-md w-7 h-7 font-bold text-slate-600"
                      >
                        -
                      </button>
                      <span className="w-6 font-bold text-slate-800 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.tempId, item.cantidad + 1)
                        }
                        className="flex justify-center items-center bg-white hover:bg-slate-100 border border-slate-300 rounded-md w-7 h-7 font-bold text-slate-600"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.tempId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="z-20 flex flex-col flex-none gap-5 bg-white p-6">
        <div className="relative">
          <Autocomplete
            placeholder="Escriba el nombre o código del producto..."
            searchValue={productSearch}
            onSearchChange={setProductSearch}
            selectedItem={null}
            options={filteredProducts}
            getDisplayValue={(p) => p.nombre}
            onSelect={(p) => {
              addItem(p);
              setProductSearch("");
            }}
            onClear={() => setProductSearch("")}
            icon={<PackageSearch className="w-5 h-5 text-blue-600" />}
            inputHeightClass="h-[46px]"
            dropdownPosition="top"
            renderOption={(p) => (
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {p.nombre}
                  </div>
                  <div className="text-slate-500 text-xs">
                    Cód: {p.codigoBarras}
                  </div>
                </div>
                <div className="font-bold text-emerald-600">
                  S/ {p.precioVenta.toFixed(2)}
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex md:flex-row flex-col justify-between items-center gap-6 bg-slate-50 p-5 border border-slate-200 rounded-xl">
          <div className="md:text-left text-center">
            <p className="font-black text-slate-800 text-2xl md:text-3xl tracking-tight">
              TOTAL{" "}
              <span className="ml-2 text-blue-600">
                S/ {totals.total.toFixed(2)}
              </span>
            </p>
            <p className="mt-1 font-semibold text-slate-500 text-sm">
              Subtotal: S/ {totals.subtotal.toFixed(2)} &nbsp;&bull;&nbsp; IGV:{" "}
              S/ {totals.igv.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant="secondary"
              size="xl"
              className="flex-1 md:w-48 text-base"
            >
              VISTA PREVIA
            </Button>
            <Button
              variant="success"
              size="xl"
              className="flex-1 md:w-56 text-base"
            >
              PROCESAR VENTA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};