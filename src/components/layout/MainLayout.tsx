import { Outlet, Link } from "react-router-dom";
import { useMainLayout } from "../../hooks/useMainLayout";
import styles from "../../styles/modules/main-layout.module.css";
import {
  Home,
  Truck,
  Users,
  FileText,
  BarChart3,
  LogOut,
  ShieldCheck,
  Package,
  Settings,
} from "lucide-react";

export const MainLayout = () => {
  const { handleLogout } = useMainLayout();

  return (
    <div className={styles.layoutContainer}>
      {/* Barra Lateral */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <span>FleetSUNAT 2026</span>
        </div>

        <nav className={styles.navLinks}>
          <Link to="/dashboard" className={styles.link}>
            <Home className="w-5 h-5" />
            Inicio
          </Link>
          <Link to="/vehicles" className={styles.link}>
            <Truck className="w-5 h-5" />
            Vehículos
          </Link>
          <Link to="/products" className={styles.link}>
            <Package className="w-5 h-5" /> Productos
          </Link>
          <Link to="/clients" className={styles.link}>
            <Users className="w-5 h-5" />
            Clientes
          </Link>
          <Link to="/sales" className={styles.link}>
            <FileText className="w-5 h-5" />
            Facturación
          </Link>
          <Link to="/reports" className={styles.link}>
            <BarChart3 className="w-5 h-5" />
            Reportes
          </Link>
          <Link to="/settings" className={styles.link}>
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </header>

        <div className={styles.pageContent}>
          {/* Aquí React Router inyectará las páginas dinámicamente */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};
