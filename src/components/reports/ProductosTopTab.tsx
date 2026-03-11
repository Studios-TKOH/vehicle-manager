import React from 'react';
import { Button } from '@components/ui/Button';
import styles from '@styles/modules/reports.module.css';

interface ProductosTopTabProps {
    products: any[];
}

export const ProductosTopTab: React.FC<ProductosTopTabProps> = ({ products }) => {
    return (
        <div className="flex flex-col gap-6">
            <section className={styles.cardFilters}>
                <div className={styles.noFiltersMessage}>
                    RANKING DE PRODUCTOS BASADO EN VENTAS CONFIRMADAS
                </div>
            </section>

            <div className={styles.cardActions}>
                <Button variant="primary" className={styles.btnDownload}>
                    Exportar Ranking
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.excelTable}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.cantidad}</td>
                                <td>S/ {p.ingresos.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};