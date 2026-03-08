import { useSettings } from "@hooks/useSettings";
import styles from "@styles/modules/Settings.module.css";
import { Building, FileText, Users, Store } from "lucide-react";
import { BranchesTab } from "@components/branches/BranchesTab";
import { CompanyTab } from "@components/company/CompanyTab";

export const Settings = () => {
  const { activeTab, setActiveTab, seriesData, usersData } = useSettings();

  return (
    <div className={styles.container}>
      {/* Menú Lateral de Ajustes */}
      <aside className={styles.tabsSidebar}>
        <h3 className={styles.sidebarTitle}>Ajustes del Sistema</h3>
        <button
          onClick={() => setActiveTab("empresa")}
          className={`${styles.tabBtn} ${activeTab === "empresa" ? styles.activeTab : ""}`}
        >
          <Building className={styles.iconMedium} /> Empresa Principal
        </button>
        <button
          onClick={() => setActiveTab("sucursales")}
          className={`${styles.tabBtn} ${activeTab === "sucursales" ? styles.activeTab : ""}`}
        >
          <Store className={styles.iconMedium} /> Locales / Sucursales
        </button>
        <button
          onClick={() => setActiveTab("series")}
          className={`${styles.tabBtn} ${activeTab === "series" ? styles.activeTab : ""}`}
        >
          <FileText className={styles.iconMedium} /> Series de Facturación
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`${styles.tabBtn} ${activeTab === "usuarios" ? styles.activeTab : ""}`}
        >
          <Users className={styles.iconMedium} /> Usuarios
        </button>
      </aside>

      {/* Área de Contenido */}
      <main className={styles.contentArea}>
        {/* TABS MODULARIZADOS */}
        {activeTab === "empresa" && <CompanyTab />}
        {activeTab === "sucursales" && <BranchesTab />}

        {/* TAB 3: SERIES DE FACTURACIÓN (Siguiente paso a modularizar) */}
        {activeTab === "series" && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>
              <FileText className={styles.iconBlue} /> Series de Comprobantes
            </h2>
            <p className={styles.sectionSubtitle}>
              Control de correlativos para la emisión electrónica por sucursal.
            </p>
            <div className={styles.cardGrid}>
              {seriesData.map((serie) => (
                <div key={serie.id} className={styles.infoCard}>
                  <div
                    className={`${styles.cardBadge} ${
                      serie.docType === "01"
                        ? styles.badgeFactura
                        : styles.badgeBoleta
                    }`}
                  >
                    {serie.docType === "01"
                      ? "FACTURA"
                      : serie.docType === "03"
                        ? "BOLETA"
                        : "OTRO"}
                  </div>
                  <h4 className={styles.serieBigText}>{serie.series}</h4>
                  <p className={styles.cardText}>
                    Correlativo actual:{" "}
                    <strong className={styles.serieNumber}>
                      {String(serie.nextCorrelative - 1).padStart(6, "0")}
                    </strong>
                  </p>
                  <p className={styles.serieFooter}>
                    Asignada a: {serie.branchId || "Sucursal Desconocida"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: USUARIOS (Pendiente) */}
        {activeTab === "usuarios" && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>
              <Users className={styles.iconBlue} /> Cuentas de Acceso
            </h2>
            <p className={styles.sectionSubtitle}>
              Personal autorizado para operar el sistema offline-first.
            </p>
            <div className={styles.cardGrid}>
              {usersData.map((user) => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userAvatarBox}>
                    <Users className={styles.userAvatarIcon} />
                  </div>
                  <div>
                    <h4 className={styles.userName}>{user.nombre}</h4>
                    <p className={styles.userEmail}>{user.email}</p>
                    <span className={styles.userRoleBadge}>{user.rol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
