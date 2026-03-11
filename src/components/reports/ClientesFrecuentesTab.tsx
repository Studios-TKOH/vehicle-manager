import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';

interface ClientesFrecuentesTabProps {
    sales: any[];
}

export const ClientesFrecuentesTab: React.FC<ClientesFrecuentesTabProps> = ({ sales }) => {
    const statsClientes = sales.reduce((acc: any, sale) => {
        const clienteId = sale.customerId;
        if (!acc[clienteId]) {
            acc[clienteId] = {
                nombre: sale.clienteNombre || 'Cliente Desconocido',
                visitas: 0,
                totalGastado: 0,
                ultimaCompra: sale.issueDate
            };
        }
        acc[clienteId].visitas += 1;
        acc[clienteId].totalGastado += sale.totalAmount;
        if (new Date(sale.issueDate) > new Date(acc[clienteId].ultimaCompra)) {
            acc[clienteId].ultimaCompra = sale.issueDate;
        }
        return acc;
    }, {});

    const rankingClientes = Object.values(statsClientes)
        .sort((a: any, b: any) => b.totalGastado - a.totalGastado)
        .slice(0, 10); // cantidad listado

    return (
        <div className="flex flex-col gap-6">
            <section className={styles.cardFilters}>
                <div className={styles.dateGroup}>
                    <FormField label="Métrica de Ranking">
                        <select className="w-full font-semibold text-xs select-base">
                            <option>Por Volumen de Compras (S/)</option>
                            <option>Por Frecuencia (Visitas)</option>
                        </select>
                    </FormField>
                </div>
                <div className={styles.noFiltersMessage}>
                    ANÁLISIS DE FIDELIZACIÓN DE CLIENTES
                </div>
            </section>

            <div className={styles.cardActions}>
                <Button variant="outline" className={styles.btnPreview}>
                    Imprimir Lista
                </Button>
                <Button variant="primary" className={styles.btnDownload}>
                    Exportar Clientes
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.excelTable}>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Frecuencia</th>
                            <th >Total Invertido</th>
                            <th>Última Visita</th>
                        </tr>
                    </thead>
                    <tbody >
                        {rankingClientes.length > 0 ? (
                            rankingClientes.map((c: any, index) => (
                                <tr key={index} >
                                    <td >
                                        {c.nombre}
                                    </td>
                                    <td >
                                        <span>
                                            {c.visitas} servicios
                                        </span>
                                    </td>
                                    <td>
                                        S/ {c.totalGastado.toFixed(2)}
                                    </td>
                                    <td>
                                        {new Date(c.ultimaCompra).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>
                                    No hay datos suficientes para generar el ranking.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};