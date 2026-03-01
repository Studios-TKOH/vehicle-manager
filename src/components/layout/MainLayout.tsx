import { Outlet, Link, useLocation } from "react-router-dom";
import { useMainLayout } from "../../hooks/useMainLayout";
import styles from "../../styles/modules/main-layout.module.css";
import {
  Home,
  Truck,
  Users,
  FileText,
  BarChart3,
  LogOut,
  Package,
  Settings,
  MapPin,
} from "lucide-react";
import { LogoutConfirmModal } from "../auth/LogoutConfirmModal";

export const MainLayout = () => {
  const {
    user,
    availableBranches,
    selectedBranchId,
    handleBranchChange,
    isLogoutModalOpen,
    requestLogout,
    cancelLogout,
    confirmLogout,
    handleProfileClick,
  } = useMainLayout();

  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? styles.activeLink : "";

  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.layoutContainer}>
      {/* Barra Lateral */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img
            src="/assets/logo-empresa.png"
            alt="Studios TKOH Logo"
            className={styles.logoImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
            }}
          />
          <span>Studios TKOH</span>
        </div>

        <nav className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.link} ${location.pathname === "/" ? styles.activeLink : ""}`}
          >
            <Home className="w-5 h-5" /> Inicio
          </Link>
          <Link
            to="/vehicles"
            className={`${styles.link} ${isActive("/vehicles")}`}
          >
            <Truck className="w-5 h-5" /> Vehículos
          </Link>
          <Link
            to="/products"
            className={`${styles.link} ${isActive("/products")}`}
          >
            <Package className="w-5 h-5" /> Productos
          </Link>
          <Link
            to="/clients"
            className={`${styles.link} ${isActive("/clients")}`}
          >
            <Users className="w-5 h-5" /> Clientes
          </Link>
          <Link to="/sales" className={`${styles.link} ${isActive("/sales")}`}>
            <FileText className="w-5 h-5" /> Facturación
          </Link>
          <Link
            to="/reports"
            className={`${styles.link} ${isActive("/reports")}`}
          >
            <BarChart3 className="w-5 h-5" /> Reportes
          </Link>
          <Link
            to="/settings"
            className={`${styles.link} ${isActive("/settings")}`}
          >
            <Settings className="w-5 h-5" /> Configuración
          </Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {/* Selector de Sucursales (Oculto si solo tiene 1, visible si tiene más) */}
            {availableBranches.length > 0 && (
              <div className={styles.branchSelectorContainer}>
                <MapPin className={styles.branchIcon} />
                <select
                  className={styles.branchSelect}
                  value={selectedBranchId}
                  onChange={handleBranchChange}
                  title="Cambiar Sucursal Activa"
                  disabled={availableBranches.length === 1} // Si solo tiene 1 sucursal, no lo dejamos cambiar
                >
                  {availableBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.topbarRight}>
            <div
              className={styles.userProfile}
              onClick={handleProfileClick}
              title="Ir a Configuración"
            >
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user?.nombre || "Usuario"}
                </span>
                <span className={styles.userRole}>
                  {user?.rol || "Sin Rol"}
                </span>
              </div>
              <div className={styles.avatarCircle}>{initial}</div>
            </div>

            <button onClick={requestLogout} className={styles.logoutBtn}>
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </header>

        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};
