import React, { useState, useEffect } from 'react';
import { REPORTES_DISPONIBLES } from '@constants/reports/reports';
import { useReports } from '@hooks/useReports';
import { db } from '@data/LocalDB';
import styles from '@styles/modules/reports.module.css';

import { VentasGeneralTab } from '@components/reports/VentasGeneralTab';
import { ProductosTopTab } from '@components/reports/ProductosTopTab';
import { VehiculoHistorialTab } from '@components/reports/VehiculoHistorialTab';
import { ClientesFrecuentesTab } from '@components/reports/ClientesFrecuentesTab';

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState(REPORTES_DISPONIBLES[0].id);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [branches, setBranches] = useState<{ id: string; nombre: string }[]>([]);

    const { topProductos, ventasRecientes, isLoading } = useReports();

    useEffect(() => {
        const loadBranches = async () => {
            const all = await db.branches.toArray();
            setBranches(all.filter(b => b.deletedAt === null).map(b => ({ id: b.id, nombre: b.nombre })));
        };
        loadBranches();
    }, []);

    const TabComponents: Record<string, React.ReactNode> = {
        ventas_general: <VentasGeneralTab sales={ventasRecientes} branchId={selectedBranch} />,
        productos_vendidos: <ProductosTopTab products={topProductos} />,
        historial_vehiculos: <VehiculoHistorialTab sales={ventasRecientes} />,
        clientes_frecuentes: <ClientesFrecuentesTab sales={ventasRecientes} />
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className={styles.pageTitle}>Centro de Reportes</h1>

                    <div className="flex items-center gap-3">
                        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Sede:</span>
                        <select
                            className="w-64 select-base"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="">Todas las Sedes</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <nav className={styles.tabsWrapper}>
                    {REPORTES_DISPONIBLES.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
                        >
                            {tab.titulo}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center gap-3 h-full">
                        <div className="border-blue-600 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
                        <span className="font-medium text-slate-400">Cargando datos...</span>
                    </div>
                ) : (
                    <div className="slide-in-from-bottom-2 animate-in duration-300 fade-in">
                        {TabComponents[activeTab] || <div className={styles.noFiltersMessage}>Reporte no encontrado</div>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;