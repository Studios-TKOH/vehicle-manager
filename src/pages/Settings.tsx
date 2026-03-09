import { useSettings } from "@hooks/useSettings";
import styles from "@styles/modules/Settings.module.css";
import { Building, FileText, Users, Store } from "lucide-react";
import { CompanyTab } from "@components/company/CompanyTab";
import { BranchesTab } from "@components/branches/BranchesTab";
import { SeriesTab } from "@components/series/SeriesTab";
import { UsersTab } from "@components/users/UsersTab";

export const Settings = () => {
  const { activeTab, setActiveTab } = useSettings();

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
        {activeTab === "empresa" && <CompanyTab />}
        {activeTab === "sucursales" && <BranchesTab />}
        {activeTab === "series" && <SeriesTab changeTab={setActiveTab} />}
        {activeTab === "usuarios" && <UsersTab changeTab={setActiveTab} />}
      </main>
    </div>
  );
};
