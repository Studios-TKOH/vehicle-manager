import { X, Tag, Barcode, DollarSign, Activity } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";

export const ProductDetailsModal = ({ isOpen, onClose, product }: any) => {
    if (!isOpen || !product) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${styles.modalContentLarge}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <div className={styles.modalTitleIconBox}>
                            <Tag size={28} className="text-blue-600" />
                        </div>
                        <div className={styles.modalTitleTextContainer}>
                            <span className={styles.modalTitleText}>Expediente</span>
                            <span className={styles.modalTitleSubtext}>Ficha Técnica de Producto</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <span className={styles.infoCardLabel}>Nombre del Producto</span>
                            <div className={styles.infoCardValue}>{product.nombre}</div>
                            <div className={styles.infoCardBadgeGroup}>
                                <span className={styles.infoCardBadge}>{product.categoria}</span>
                                <span className={`${styles.infoCardBadge} text-blue-600 bg-blue-50 border-blue-100`}>{product.unidadMedida}</span>
                            </div>
                        </div>

                        <div className={`${styles.infoCard} flex flex-col items-center justify-center text-center`}>
                            <Barcode size={48} className="mb-4 text-slate-300" />
                            <span className={styles.infoCardLabel}>Código de Barras / SKU</span>
                            <div className="font-mono font-black text-slate-700 text-3xl tracking-widest">{product.codigoBarras}</div>
                        </div>
                    </div>

                    <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-blue-50/50 p-8 border border-blue-100 rounded-[2.5rem]">
                            <span className={styles.infoCardLabel} style={{ color: '#1e40af' }}>Precio de Venta (IGV Inc.)</span>
                            <div className="mt-2 font-black text-blue-900 text-5xl">S/ {Number(product.precioVenta).toFixed(2)}</div>
                            <p className="mt-4 font-bold text-blue-600/60 text-xs uppercase tracking-tighter">
                                Afectación: {product.afectacionIgv === "10" ? "Gravado - Operación Onerosa" : "Exonerado"}
                            </p>
                        </div>

                        <div className="bg-orange-50/50 p-8 border border-orange-100 rounded-[2.5rem]">
                            <span className={styles.infoCardLabel} style={{ color: '#9a3412' }}>Frecuencia de Mantenimiento</span>
                            <div className="mt-2 font-black text-orange-900 text-5xl">
                                {product.frecuenciaCambioKm ? `${product.frecuenciaCambioKm.toLocaleString()} KM` : "N/A"}
                            </div>
                            <p className="mt-4 font-bold text-orange-600/60 text-xs uppercase tracking-tighter">
                                Indicador para alertas de servicio técnico
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>Cerrar Expediente</button>
                </div>
            </div>
        </div>
    );
};