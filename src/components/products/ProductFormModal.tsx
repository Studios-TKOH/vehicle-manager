import { X, FileDigit, Tag, DollarSign, Activity, Save, ArrowLeft } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    formData: any;
    categories: string[];
    onChange: (e: any) => void;
    onSave: () => void;
}

export const ProductFormModal = ({ isOpen, onClose, mode, formData, categories, onChange, onSave }: Props) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} !max-w-2xl animate-in zoom-in-95 duration-200`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <div className={styles.modalTitleIconBox}>
                            <Tag size={28} className="text-blue-600" />
                        </div>
                        <div className={styles.modalTitleTextContainer}>
                            <span className={styles.modalTitleText}>
                                {mode === 'add' ? "Nuevo Producto" : "Editar Producto"}
                            </span>
                            <span className={styles.modalTitleSubtext}>
                                Rellena los campos para registrar un nuevo item en el inventario.
                            </span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <div className={styles.modalBody}>
                    <form>
                        <span className={styles.formSectionTitle}>Información del Producto</span>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={`${styles.label} flex items-center gap-2`}><FileDigit size={14} /> Código de Barras / SKU</label>
                                <input name="codigoBarras" className={styles.input} value={formData.codigoBarras} onChange={onChange} placeholder="Ej: 7751234..." />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={`${styles.label} flex items-center gap-2`}><Tag size={14} /> Categoría</label>
                                <input name="categoria" className={styles.input} value={formData.categoria} onChange={onChange} list="cat-list" placeholder="Selecciona o escribe..." />
                                <datalist id="cat-list">
                                    {categories.filter(c => c !== "TODAS").map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>

                            <div className={styles.formGroupWide}>
                                <label className={styles.label}>Nombre descriptivo del Producto o Servicio</label>
                                <input name="nombre" className={styles.input} value={formData.nombre} onChange={onChange} placeholder="Ej: Aceite Castrol Magnatec 10W-40..." />
                            </div>
                        </div>
                        
                        <span className={`${styles.formSectionTitle} mt-8`}>Configuración de Venta y Servicio</span>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={`${styles.label} flex items-center gap-2`}><DollarSign size={14} /> Precio de Venta</label>
                                <div className="flex">
                                    <span className="flex items-center bg-slate-50 px-3 border border-slate-300 border-r-0 rounded-l-xl font-medium text-slate-600 text-sm">S/</span>
                                    <input type="number" step="0.01" name="precioVenta" className={`${styles.input} !rounded-l-none`} value={formData.precioVenta} onChange={onChange} />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Unidad de Medida</label>
                                <select name="unidadMedida" className={styles.input} value={formData.unidadMedida} onChange={onChange}>
                                    <option value="NIU">NIU - Unidad / Servicio</option>
                                    <option value="GAL">GAL - Galón</option>
                                    <option value="LTR">LTR - Litro</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={`${styles.label} flex items-center gap-2`}><Activity size={14} /> Frecuencia de Cambio</label>
                                <div className="flex">
                                    <input type="number" name="frecuenciaCambioKm" className={`${styles.input} !rounded-r-none`} value={formData.frecuenciaCambioKm} onChange={onChange} />
                                    <span className="flex items-center bg-slate-50 px-3 border border-slate-300 border-l-0 rounded-r-xl font-medium text-slate-600 text-sm">KM</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Afectación IGV</label>
                                <select name="afectacionIgv" className={styles.input} value={formData.afectacionIgv} onChange={onChange}>
                                    <option value="10">10 - Gravado</option>
                                    <option value="20">20 - Exonerado</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}><ArrowLeft size={16} /> CANCELAR</button>
                    <button className={styles.btnPrimary} onClick={onSave}><Save size={16} /> GUARDAR CAMBIOS</button>
                </div>
            </div>
        </div>
    );
};