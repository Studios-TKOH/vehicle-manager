import { Outlet, Link, useLocation } from "react-router-dom";
import { useMainLayout } from "@hooks/useMainLayout";
import styles from "@styles/modules/main-layout.module.css";
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
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Receipt,
  ClipboardType,
} from "lucide-react";
import { LogoutConfirmModal } from "@components/auth/LogoutConfirmModal";
import { UnderConstructionModal } from "@components/ui/UnderConstructionModal";

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
    isSidebarCollapsed,
    toggleSidebar,
    constructionModal,
    openConstructionModal,
    closeConstructionModal,
  } = useMainLayout();

  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? styles.activeLink : "";

  const initial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U";

  return (
    <div className={styles.layoutContainer}>
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${styles.sidebar} ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}
      >
        {/* Header del Sidebar */}
        <div className={styles.sidebarHeader}>
          <div className={styles.brandContainer}>
            <div className={styles.logoBox}>MD</div>
            <span className={styles.brandName}>MotorDesk</span>
          </div>

          {/* Botón para colapsar/expandir */}
          <button
            onClick={toggleSidebar}
            className={styles.collapseBtn}
            title={isSidebarCollapsed ? "Expandir" : "Colapsar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        </div>

        {/* Links de Navegación Anidada */}
        <nav className={styles.scrollArea}>
          {/* Categoría: DASHBOARD */}
          <div className={styles.navCategory}>Dashboard</div>

          <Link
            to="/"
            className={`${styles.link} ${isActive("/")}`}
            title="Inicio"
          >
            <Home className={styles.linkIcon} />
            <span className={styles.linkText}>Inicio</span>
          </Link>

          <Link
            to="/sales"
            className={`${styles.link} ${isActive("/sales")}`}
            title="Facturación"
          >
            <FileText className={styles.linkIcon} />
            <span className={styles.linkText}>Facturación</span>
          </Link>

          <Link
            to="/sales-history"
            className={`${styles.link} ${isActive("/sales-history")}`}
            title="Historial de Ventas"
          >
            <Receipt className={styles.linkIcon} />
            <span className={styles.linkText}>Historial de Ventas</span>
          </Link>

          <Link
            to="/clients"
            className={`${styles.link} ${isActive("/clients")}`}
            title="Clientes"
          >
            <Users className={styles.linkIcon} />
            <span className={styles.linkText}>Clientes</span>
          </Link>

          <Link
            to="/vehicles"
            className={`${styles.link} ${isActive("/vehicles")}`}
            title="Vehículos"
          >
            <Truck className={styles.linkIcon} />
            <span className={styles.linkText}>Vehículos</span>
          </Link>

          <Link
            to="/products"
            className={`${styles.link} ${isActive("/products")}`}
            title="Productos"
          >
            <Package className={styles.linkIcon} />
            <span className={styles.linkText}>Productos</span>
          </Link>

          <Link
            to="/reports"
            className={`${styles.link} ${isActive("/reports")}`}
            title="Reportes"
          >
            <BarChart3 className={styles.linkIcon} />
            <span className={styles.linkText}>Reportes</span>
          </Link>

          {/* Guías de Remisión (Aún En construcción) */}
          <button
            className={`${styles.sidebarButtonLink} ${styles.link}`}
            title="Guías de Remisión"
            onClick={() => openConstructionModal("Guías de Remisión")}
          >
            <ClipboardType className={styles.linkIcon} />
            <span className={styles.linkText}>Guías de Remisión</span>
          </button>

          {/* Categoría: SETTINGS */}
          <div className={styles.navCategory}>Configuración</div>

          <Link
            to="/settings"
            className={`${styles.link} ${isActive("/settings")}`}
            title="Configuración"
          >
            <Settings className={styles.linkIcon} />
            <span className={styles.linkText}>Configuración</span>
          </Link>
        </nav>

        {/* Footer del Sidebar (Ayuda y Logout) */}
        <div className={styles.sidebarFooter}>
          {/* Botón de ayuda conectado al modal de construcción */}
          <button
            className={styles.logoutBtn}
            title="Ayuda"
            onClick={() => openConstructionModal("Centro de Ayuda")}
          >
            <HelpCircle className={styles.linkIcon} />
            <span className={styles.linkText}>Ayuda</span>
          </button>

          {/* El botón de Logout ahora vive en la base del sidebar */}
          <button
            onClick={requestLogout}
            className={styles.logoutBtn}
            title="Cerrar Sesión"
          >
            <LogOut className={styles.linkIcon} />
            <span className={styles.linkText}>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main className={styles.mainContent}>
        {/* Cabecera Superior (TopBar) */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            {isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className={styles.mobileExpandBtn}
                title="Expandir Menú"
              >
                <PanelLeftOpen size={24} />
              </button>
            )}

            {/* Selector de Sucursales */}
            {availableBranches.length > 0 && (
              <div className={styles.branchSelectorContainer}>
                <MapPin className={styles.branchIcon} />
                <select
                  className={styles.branchSelect}
                  value={selectedBranchId}
                  onChange={handleBranchChange}
                  title="Cambiar Sucursal Activa"
                  disabled={availableBranches.length === 1}
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
            {/* Perfil de Usuario */}
            <div
              className={styles.userProfile}
              onClick={handleProfileClick}
              title="Ir a Ajustes de Perfil"
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

      <UnderConstructionModal
        isOpen={constructionModal.isOpen}
        moduleName={constructionModal.moduleName}
        onClose={closeConstructionModal}
      />
    </div>
  );
};
