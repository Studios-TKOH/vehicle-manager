import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';
import { exportToExcel } from '@utils/excel';
import { formatToDate, formatToDateTime, toLocalISO } from '@utils/dateFormats';
import { DOC_TYPES, type DocTypeCode } from '@constants/docTypes';

interface VentasGeneralTabProps {
    sales: any[];
    branchId: string;
}

export const VentasGeneralTab: React.FC<VentasGeneralTabProps> = ({ sales, branchId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [saleType, setSaleType] = useState<DocTypeCode | ''>('');

    const filteredData = sales.filter(s => {
        const matchBranch = branchId ? s.branchId === branchId : true;
        const saleDateLocal = toLocalISO(s.issueDate);
        const matchStart = startDate ? saleDateLocal >= startDate : true;
        const matchEnd = endDate ? saleDateLocal <= endDate : true;

        const matchType = saleType ? s.docType === saleType : true;

        return matchBranch && matchStart && matchEnd && matchType;
    });

    const handleExportExcel = async () => {
        const totals = filteredData.reduce((acc, v) => {
            acc.descuento += (v.totalDiscount || 0);
            acc.gravado += (v.subtotalAmount || 0);
            acc.igv += (v.igvAmount || 0);
            acc.total += (v.totalAmount || 0);
            return acc;
        }, { descuento: 0, gravado: 0, igv: 0, total: 0 });

        const dataToExport = filteredData.map(v => ({
            'SERIE': v.series,
            'NÚMERO': String(v.correlativeNumber).padStart(6, '0'),
            'TIPO DOC': DOC_TYPES[v.docType as DocTypeCode]?.label ?? v.docType,
            'SUCURSAL': v.sucursalNombre,
            'CLIENTE DOC': v.clienteDoc,
            'CLIENTE NOMBRE': v.clienteNombre,
            'FECHA DE EMISION': formatToDate(v.issueDate),
            'FECHA DE VENCIMIENTO': formatToDate(v.dueDate),
            'FECHA DE CREACION': formatToDateTime(v.createdAt),
            'USUARIO': v.vendedor,
            'PLACA VEHICULO': v.vehiclePlate || 'N/A',
            'ORDEN DE COMPRA': '-',
            'GUIAS DE REMISION ': '-',
            'COND. DE PAGO': v.condicionPago,
            'MET. DE PAGO': v.metodoPago,
            'CUOTAS': 0,
            'OBSERVACIONES': v.observaciones,
            'OTROS': '-',
            'MONEDA': v.currency,
            'DESCUENTO': (v.totalDiscount || 0).toFixed(2),
            'GRAVADO': (v.subtotalAmount || 0).toFixed(2),
            'IGV': (v.igvAmount || 0).toFixed(2),
            'TOTAL': (v.totalAmount || 0).toFixed(2),
            'ESTADO SUNAT': v.sunatStatus
        }));

        await exportToExcel(dataToExport, 'Reporte_Ventas_General', totals, 'ventas_general');
    };

    return (
        <div className="flex flex-col gap-8">
            <section className={styles.cardFilters}>
                <div className={styles.dateGroup}>
                    <FormField label="Fecha Inicio">
                        <div className={styles.dateBox}>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                    </FormField>
                </div>

                <div className={styles.dateGroup}>
                    <FormField label="Fecha Fin">
                        <div className={styles.dateBox}>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                    </FormField>
                </div>

                <div className={styles.dateGroup}>
                    <FormField label="Tipo de Comprobante">
                        <div className={styles.branchSelectorGroup}>
                            <select
                                value={saleType}
                                onChange={(e) => setSaleType(e.target.value as DocTypeCode | '')}
                                className={styles.filterSelect}
                            >
                                <option value="">Todos los documentos</option>
                                {Object.entries(DOC_TYPES).map(([code, doc]) => (
                                    <option key={code} value={code}>
                                        {doc.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </FormField>
                </div>

                {(startDate || endDate || saleType) && (
                    <div className={styles.clearFilterContainer}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setStartDate(''); setEndDate(''); setSaleType(''); }}
                            className="font-bold text-[11px] text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </section>

            <div className={styles.cardActions}>
                <Button
                    className={styles.btnPreview}
                    onClick={handleExportExcel}
                >
                    Exportar {filteredData.length} registros (Excel)
                </Button>

                <Button className={styles.btnDownload}>
                    Descargar PDF
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.excelTable}>
                    <thead>
                        <tr>
                            <th className={styles.thBase}>Fecha</th>
                            <th className={styles.thBase}>Documento</th>
                            <th className={styles.thBase}>Cliente</th>
                            <th className={styles.thBase}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((v) => (
                                <tr key={v.id}>
                                    <td className={styles.colDate}>
                                        {formatToDate(v.issueDate)}
                                    </td>
                                    <td>
                                        <span className="font-semibold text-blue-600">
                                            {v.series}-{String(v.correlativeNumber).padStart(6, "0")}
                                        </span>
                                    </td>
                                    <td>{v.clienteNombre}</td>
                                    <td className={styles.colAmount}>
                                        S/ {(v.totalAmount || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-slate-400 text-center italic">
                                    No hay registros para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};