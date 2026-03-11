import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';

interface VehiculoHistorialTabProps {
    sales: any[];
}

export const VehiculoHistorialTab: React.FC<VehiculoHistorialTabProps> = ({ sales }) => {
    const [searchPlaca, setSearchPlaca] = useState('');

    const filteredHistory = sales.filter(sale =>
        searchPlaca === '' ||
        sale.vehiclePlate?.toLowerCase().includes(searchPlaca.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <section className={styles.cardFilters}>
                <div className={styles.dateGroup}>
                    <FormField label="Buscar Vehículo (Placa)">
                        <div className={styles.dateBox}>
                            <Input
                                type="text"
                                placeholder="Ej: ABC-123"
                                value={searchPlaca}
                                onChange={(e) => setSearchPlaca(e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                    </FormField>
                </div>

                <div className={styles.noFiltersMessage}>
                    FILTRANDO HISTORIAL DE MANTENIMIENTOS
                </div>
            </section>

            <div className={styles.cardActions}>
                <Button variant="outline" className={styles.btnPreview}>
                    Ver Hoja de Servicio
                </Button>
                <Button variant="primary" className={styles.btnDownload}>
                    Descargar Historial
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.excelTable}>
                    <thead>
                        <tr>
                            <th >Fecha</th>
                            <th >Placa</th>
                            <th >Servicio / Documento</th>
                            <th >Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((v) => (
                                <tr key={v.id} >
                                    <td >
                                        {new Date(v.issueDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {v.vehiclePlate || 'N/A'}
                                    </td>
                                    <td >
                                        {v.series}-{v.correlativeNumber}
                                    </td>
                                    <td>
                                        S/ {v.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>
                                    No hay registros para el vehículo consultado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};