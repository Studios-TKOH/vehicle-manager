import { Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>FleetSUNAT 2026</div>
        <nav className={styles.navLinks}>
          <Link to="/" className={styles.link}>
            🏠 Inicio
          </Link>
          <Link to="/vehicles" className={styles.link}>
            🚛 Vehículos
          </Link>
          <Link to="/sales" className={styles.link}>
            📄 Facturación
          </Link>
          <Link to="/reports" className={styles.link}>
            📊 Reportes
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
