import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';

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
                <Button variant="outline" className={styles.btnPreview}>
                    Vista Previa (Excel)
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
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((v) => (
                            <tr key={v.id}>
                                <td className={styles.colDate}>
                                    {new Date(v.issueDate).toLocaleDateString()}
                                </td>
                                <td>
                                    <span>
                                        {v.series}-{v.correlativeNumber}
                                    </span>
                                </td>
                                <td>
                                    {v.clienteNombre}
                                </td>
                                <td className={styles.colAmount}>
                                    S/ {v.totalAmount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};