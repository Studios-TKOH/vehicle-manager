import { X, Building2, User, MapPin, Phone, Mail, Truck } from "lucide-react";
import styles from "@styles/modules/Customers.module.css";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    customer: any;
}

export const CustomerDetailsModal = ({ isOpen, onClose, customer }: Props) => {
    if (!isOpen || !customer) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={`${styles.modalContent} ${styles.modalContentLarge}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>
                        <div className={styles.modalTitleIconBox}>
                            {customer.tipoDocumentoIdentidad === "RUC" ? <Building2 size={28} className="text-blue-600" /> : <User size={28} className="text-blue-600" />}
                        </div>
                        <div className={styles.modalTitleTextContainer}>
                            <span className={styles.modalTitleText}>Expediente</span>
                            <span className={styles.modalTitleSubtext}>Ficha Maestra del Cliente</span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <span className={styles.infoCardLabel}>Identidad y Razón Social</span>
                            <div className={styles.infoCardValue}>{customer.nombreRazonSocial}</div>
                            <div className={styles.infoCardBadgeGroup}>
                                <span className={styles.infoCardBadge}>{customer.tipoDocumentoIdentidad}: {customer.numeroDocumento}</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <span className={styles.infoCardLabel}>Información de Contacto</span>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 border border-slate-200 rounded-lg text-slate-400"><Phone size={18} /></div>
                                    <span className="font-bold text-slate-700 text-lg">{customer.telefono || "---"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 border border-slate-200 rounded-lg text-slate-400"><Mail size={18} /></div>
                                    <span className="font-medium text-slate-500">{customer.email || "---"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard} style={{ width: '100%', marginBottom: '2.5rem' }}>
                        <span className={styles.infoCardLabel}>Ubicación / Dirección Fiscal</span>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 border border-slate-200 rounded-2xl text-slate-400 shrink-0"><MapPin size={24} /></div>
                            <p className="font-semibold text-slate-700 text-lg leading-relaxed">{customer.direccion || "No registrada"}</p>
                        </div>
                    </div>

                    <div className={styles.historyHeader}>
                        <h3 className={styles.historyTitle}><Truck className="text-blue-600" /> Flota de Vehículos</h3>
                    </div>

                    <div className={styles.historyList}>
                        {[...(customer.vehiculosPropios || []), ...(customer.vehiculosConducidos || [])].length > 0 ? (
                            [...(customer.vehiculosPropios || []), ...(customer.vehiculosConducidos || [])].map((v: any, idx: number) => (
                                <div key={idx} className={styles.historyCard}>
                                    <div className={styles.historyCardHeader}>
                                        <div className="flex items-center">
                                            <span className={styles.historyCardType}>{v.placa}</span>
                                            <span className={styles.historyCardDate}>{v.marca} {v.modelo}</span>
                                        </div>
                                        <span className={styles.historyCardTotal}>
                                            {v.propietarioId === customer.id ? 'PROPIO' : 'CONDUCTOR'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.historyEmptyState}>
                                <Truck size={48} className="mb-4 text-slate-200" />
                                <p className={styles.historyEmptyText}>No hay vehículos vinculados.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>Cerrar Expediente</button>
                </div>
            </div>
        </div>
    );
};