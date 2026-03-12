import React, { useState, useEffect } from "react";
import { REPORTES_DISPONIBLES } from "@constants/reports/reports";
import { useReports } from "@hooks/useReports";
import { db } from "@data/LocalDB";
import styles from "@styles/modules/reports.module.css";

import { VentasGeneralTab } from "@components/reports/VentasGeneralTab";
import { ProductosTopTab } from "@components/reports/ProductosTopTab";
import { VehiculoHistorialTab } from "@components/reports/VehiculoHistorialTab";
import { ClientesFrecuentesTab } from "@components/reports/ClientesFrecuentesTab";

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState(REPORTES_DISPONIBLES[0].id);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [branches, setBranches] = useState<{ id: string; nombre: string }[]>(
    [],
  );

  const { topProductos, ventasRecientes, historialVentas, isLoading } =
    useReports();

  useEffect(() => {
    const loadBranches = async () => {
      const all = await db.branches.toArray();
      setBranches(
        all
          .filter((b) => b.deletedAt === null)
          .map((b) => ({ id: b.id, nombre: b.nombre })),
      );
    };
    loadBranches();
  }, []);

  const TabComponents: Record<string, React.ReactNode> = {
    ventas_general: (
      <VentasGeneralTab sales={ventasRecientes} branchId={selectedBranch} />
    ),
    productos_vendidos: <ProductosTopTab products={topProductos} />,
    historial_vehiculos: <VehiculoHistorialTab sales={historialVentas} />,
    clientes_frecuentes: <ClientesFrecuentesTab sales={ventasRecientes} />,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.pageHeaderTitleRow}>
          <h1 className={styles.pageTitle}>Centro de Reportes</h1>

          <div className={styles.branchSelectorGroup}>
            <span className={styles.branchLabel}>Sede:</span>
            <select
              className={styles.branchSelect}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">Todas las Sedes</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className={styles.tabsWrapper}>
          {REPORTES_DISPONIBLES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ""}`}
            >
              {tab.titulo}
            </button>
          ))}
        </nav>
      </header>

      <main className={styles.mainContentArea}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <span className={styles.loadingText}>Cargando datos...</span>
          </div>
        ) : (
          <div className={styles.tabContentWrapper}>
            {TabComponents[activeTab] || (
              <div className={styles.noFiltersMessage}>
                Reporte no encontrado
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
