import React, { useState } from "react";
import { useSales } from "../hooks/useSales";
import styles from "../styles/modules/sales.module.css";
import {
    Search, Plus, Trash2, Printer, Save, Truck,
    ClipboardList, MessageSquare, CreditCard, PackageSearch, FileText,
    Menu as MenuIcon, X, Check
} from "lucide-react";

export const Sales = () => {
    const {
        documento, extras, handleExtraChange, inlineInputs,
        toggleInlineInput, blurInlineInput, cart, addItem,
        removeItem, updateQuantity, productSearch, setProductSearch,
        showSuggestions, setShowSuggestions, productSuggestions,
        totals, productosUsuales
    } = useSales();

    const [proformaChecked, setProformaChecked] = useState(false);
    const [visiblePreview, setVisiblePreview] = useState(false);

    const [showPlacaModal, setShowPlacaModal] = useState(false);
    const [showOrdenCompraModal, setShowOrdenCompraModal] = useState(false);
    const [showObservacionesModal, setShowObservacionesModal] = useState(false);
    const [showPagosModal, setShowPagosModal] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.titleGroup}>
                <div className="flex items-center gap-3">
                    <FileText className={`${styles.actionIcon} w-8 h-8 text-blue-600`} />
                    <h2 className={styles.pageTitle}>Nueva Venta</h2>
                </div>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={proformaChecked}
                        onChange={(e) => setProformaChecked(e.target.checked)}
                    />
                    PROFORMA
                </label>
            </div>

            <div className={styles.grid4}>
                <div className="col-span-1 md:col-span-2">
                    <label className={styles.formLabel}>Cliente</label>
                    <div className={styles.inputGroup}>
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Escribe para buscar un cliente..."
                            className={styles.inputNoBorder}
                            value={documento.cliente?.nombreRazonSocial || ""}
                            readOnly
                        />
                        {documento.cliente && (
                            <button className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                        )}
                    </div>
                </div>
                <div>
                    <label className={styles.formLabel}>Fecha de emisión</label>
                    <input type="date" className={styles.formInput} value={documento.fecha} readOnly />
                </div>
                <div>
                    <label className={styles.formLabel}>Fecha de vencimiento</label>
                    <input type="date" className={styles.formInput} />
                </div>
            </div>

            <div className={styles.grid4}>
                <div>
                    <label className={styles.formLabel}>Tipo de comprobante</label>
                    <select className={styles.formInput}>
                        <option>FACTURA ELECTRÓNICA</option>
                        <option>BOLETA DE VENTA</option>
                    </select>
                </div>
                <div>
                    <label className={styles.formLabel}>Serie y Correlativo</label>
                    <div className="flex gap-2">
                        <input type="text" value={documento.serie} readOnly className={`${styles.formInput} w-1/3 text-center bg-slate-100 font-bold`} />
                        <input type="text" value={documento.correlativo} readOnly className={`${styles.formInput} w-2/3 bg-slate-100`} />
                    </div>
                </div>
                <div>
                    <label className={styles.formLabel}>Tipo de operación</label>
                    <select className={styles.formInput}><option>VENTA INTERNA</option></select>
                </div>
                <div>
                    <label className={styles.formLabel}>Dscto. global (%)</label>
                    <input type="number" placeholder="0.00" className={styles.formInput} />
                </div>
            </div>

            <div className={styles.actionRow}>
                <button
                    onClick={() => toggleInlineInput('placa')}
                    className={`${styles.actionBtn} ${extras.placa ? styles.btnSuccess : styles.btnPrimary}`}
                >
                    {inlineInputs.placa ? (
                        <input autoFocus value={extras.placa} onChange={e => handleExtraChange('placa', e.target.value)} onBlur={() => blurInlineInput('placa')} className="bg-transparent border-white/50 border-b outline-none w-full text-center" placeholder="DIGITE PLACA" />
                    ) : (
                        <>PLACA {extras.placa && <Check className="w-4 h-4" />}</>
                    )}
                </button>

                <button
                    onClick={() => toggleInlineInput('ordenCompra')}
                    className={`${styles.actionBtn} ${extras.ordenCompra ? styles.btnSuccess : styles.btnPrimary}`}
                >
                    {inlineInputs.ordenCompra ? (
                        <input autoFocus value={extras.ordenCompra} onChange={e => handleExtraChange('ordenCompra', e.target.value)} onBlur={() => blurInlineInput('ordenCompra')} className="bg-transparent border-white/50 border-b outline-none w-full text-center" placeholder="DIGITE O.C." />
                    ) : (
                        <>O. COMPRA {extras.ordenCompra && <Check className="w-4 h-4" />}</>
                    )}
                </button>

                <button
                    onClick={() => toggleInlineInput('observaciones')}
                    className={`${styles.actionBtn} ${extras.observaciones ? styles.btnSuccess : styles.btnPrimary}`}
                >
                    {inlineInputs.observaciones ? (
                        <input autoFocus value={extras.observaciones} onChange={e => handleExtraChange('observaciones', e.target.value)} onBlur={() => blurInlineInput('observaciones')} className="bg-transparent border-white/50 border-b outline-none w-full text-center" placeholder="OBSERVACIONES" />
                    ) : (
                        <>OBSERVACIONES {extras.observaciones && <Check className="w-4 h-4" />}</>
                    )}
                </button>

                <button className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                    OTROS <MenuIcon className="w-4 h-4" />
                </button>
            </div>

            {productosUsuales.length > 0 && cart.length === 0 && (
                <div className="flex gap-2 mb-4">
                    <span className="mt-2 font-bold text-slate-500 text-xs">FRECUENTES:</span>
                    {productosUsuales.map((p: any) => (
                        <button key={p.id} onClick={() => addItem(p)} className="bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-full font-bold text-blue-700 hover:text-white text-xs transition-colors">
                            + {p.nombre}
                        </button>
                    ))}
                </div>
            )}

            <div className={styles.tableContainer}>
                {cart.length === 0 ? (
                    <div className="p-10 font-medium text-slate-400 text-sm text-center">
                        Busca un producto en la barra inferior para comenzar...
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className="text-left">Producto</th>
                                <th className="text-center">Precio Unit.</th>
                                <th className="text-center">Total</th>
                                <th className="w-32 text-center">Cantidad</th>
                                <th className="w-20 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.tempId} className="bg-white border-slate-200 last:border-0 border-b">
                                    <td className="p-3 font-medium text-slate-800 text-left">{item.nombre}</td>
                                    <td className="p-3 text-center">S/ {item.precioUnitario.toFixed(2)}</td>
                                    <td className="p-3 font-bold text-slate-800 text-center">S/ {(item.precioUnitario * item.cantidad).toFixed(2)}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => updateQuantity(item.tempId, item.cantidad - 1)} className={styles.qtyBtn}>-</button>
                                            <span className="w-8 font-semibold text-center">{item.cantidad}</span>
                                            <button onClick={() => updateQuantity(item.tempId, item.cantidad + 1)} className={styles.qtyBtn}>+</button>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => removeItem(item.tempId)} className="flex-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded font-bold text-white text-xs transition-colors">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className={`${styles.stickyBottom} flex flex-col gap-8`}>
                <div className="relative pb-6 border-slate-200 border-b">
                    <div className={styles.searchProductBox}>
                        <PackageSearch className="w-5 h-5 text-blue-600" />
                        <input
                            type="text"
                            placeholder="Escriba el nombre o código del producto..."
                            className={styles.searchProductInput}
                            value={productSearch}
                            onChange={(e) => { setProductSearch(e.target.value); setShowSuggestions(true); }}
                        />
                    </div>

                    {showSuggestions && productSuggestions.length > 0 && (
                        <div className={styles.suggestionsMenu}>
                            {productSuggestions.map((p: any) => (
                                <div key={p.id} className={styles.suggestionItem} onClick={() => addItem(p)}>
                                    <div>
                                        <strong className="block text-slate-800 text-sm">{p.nombre}</strong>
                                        <span className="text-slate-500 text-xs">{p.codigoBarras} | Stock: Disponible</span>
                                    </div>
                                    <span className="font-bold text-blue-600">S/ {p.precioVenta.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex md:flex-row flex-col justify-between items-center gap-8 pb-4">
                    <div className="flex-[2] md:text-left text-center">
                        <p className="font-bold text-slate-500 text-lg md:text-xl">
                            TOTAL <span className="ml-2 text-slate-900">S/ {totals.total.toFixed(2)}</span>
                        </p>
                        <p className="mt-1 text-slate-400 text-xs">
                            Subtotal: S/ {totals.subtotal.toFixed(2)} | IGV: S/ {totals.igv.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex flex-[3] gap-4 w-full">
                        <button className="flex-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-xl h-16 font-bold text-slate-700 text-lg transition-colors">
                            VISTA PREVIA
                        </button>
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md rounded-xl h-16 font-bold text-white text-lg transition-all hover:-translate-y-0.5">
                            PROCESAR VENTA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};