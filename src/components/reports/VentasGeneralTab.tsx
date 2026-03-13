import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';
import { exportToExcel } from '@utils/excel';
import { formatToDate, formatToDateTime } from '@utils/dateFormats';

interface VentasGeneralTabProps {
    sales: any[];
    branchId: string;
}

export const VentasGeneralTab: React.FC<VentasGeneralTabProps> = ({ sales, branchId }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredData = branchId
        ? sales.filter(s => s.branchId === branchId)
        : sales;

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
            'GRAVADO': v.subtotalAmount.toFixed(2),
            'IGV': v.igvAmount.toFixed(2),
            'TOTAL': v.totalAmount.toFixed(2),
            'ESTADO SUNAT': v.sunatStatus
        }));        

        await exportToExcel(dataToExport, 'Reporte_Ventas_General', totals);
    };

    return (
        <div className="flex flex-col gap-6">
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
            </section>

            <div className={styles.cardActions}>
                <Button
                    variant="outline"
                    className={styles.btnPreview}
                    onClick={handleExportExcel}
                >
                    Exportar (Excel)
                </Button>

                <Button variant="primary" className={styles.btnDownload}>
                    Descargar PDF
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.excelTable}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Documento</th>
                            <th>Cliente</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((v) => (
                                <tr key={v.id}>
                                    <td className={styles.colDate}>
                                        {new Date(v.issueDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="font-semibold text-blue-600">
                                            {v.series}-{String(v.correlativeNumber).padStart(6, "0")}
                                        </span>
                                    </td>
                                    <td>{v.clienteNombre}</td>
                                    <td className={styles.colAmount}>
                                        S/ {v.totalAmount.toFixed(2)}
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