import { X, Search, Loader2 } from "lucide-react";
import styles from "@styles/modules/Customers.module.css";
import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    formData: any;
    onChange: (e: any) => void;
    onSearchApi: () => void;
    isSearching: boolean;
    apiSuccess: boolean;
}

export const CustomerFormModal = ({ isOpen, onClose, mode, formData, onChange, onSearchApi, isSearching, apiSuccess }: Props) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{mode === 'add' ? "Nuevo Cliente" : "Editar Cliente"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X /></button>
                </div>
                <div className={styles.modalBody}>
                    <form className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tipo de Documento</label>
                            <Select name="tipoDocumentoIdentidad" value={formData.tipoDocumentoIdentidad} onChange={onChange}>
                                <option value="RUC">RUC (Empresa / Persona con Negocio)</option>
                                <option value="DNI">DNI (Persona Natural)</option>
                                <option value="CE">Carnet de Extranjería</option>
                            </Select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Número de Documento {apiSuccess && <span className="ml-1 text-[10px] text-green-600">✔ Validado</span>}</label>
                            <div className={styles.apiSearchWrapper}>
                                <Input name="numeroDocumento" value={formData.numeroDocumento} onChange={onChange} maxLength={formData.tipoDocumentoIdentidad === "RUC" ? 11 : 8} />
                                <button type="button" className={styles.apiBtn} onClick={onSearchApi} disabled={isSearching || formData.numeroDocumento.length < 8}>
                                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className={styles.label}>Nombres o Razón Social</label>
                            <Input name="nombreRazonSocial" value={formData.nombreRazonSocial} onChange={onChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className={styles.label}>Dirección Fiscal</label>
                            <Input name="direccion" value={formData.direccion} onChange={onChange} />
                        </div>
                        <div className={styles.formGroup}><label className={styles.label}>Teléfono</label><Input name="telefono" value={formData.telefono} onChange={onChange} /></div>
                        <div className={styles.formGroup}><label className={styles.label}>Email</label><Input name="email" value={formData.email} onChange={onChange} /></div>
                    </form>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
                    <button className={styles.btnPrimary} onClick={onClose}>{mode === 'add' ? "Guardar Cliente" : "Actualizar"}</button>
                </div>
            </div>
        </div>
    );
};