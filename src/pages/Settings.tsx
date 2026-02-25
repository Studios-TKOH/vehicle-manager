import { useSettings } from "../hooks/useSettings";
import styles from "../styles/modules/Settings.module.css";
import {
  Settings as SettingsIcon,
  Building,
  MapPin,
  FileText,
  Users,
  Store,
  Save,
} from "lucide-react";

export const Settings = () => {
  const {
    activeTab,
    setActiveTab,
    companyData,
    handleCompanyChange,
    saveCompanySettings,
    branchesData,
    seriesData,
    usersData,
  } = useSettings();

  return (
    <div className={styles.container}>
      {/* Menú Lateral de Ajustes */}
      <aside className={styles.tabsSidebar}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">
          Ajustes del Sistema
        </h3>
        <button
          onClick={() => setActiveTab("empresa")}
          className={`${styles.tabBtn} ${activeTab === "empresa" ? styles.activeTab : ""}`}
        >
          <Building className="w-5 h-5" /> Empresa Principal
        </button>
        <button
          onClick={() => setActiveTab("sucursales")}
          className={`${styles.tabBtn} ${activeTab === "sucursales" ? styles.activeTab : ""}`}
        >
          <Store className="w-5 h-5" /> Locales / Sucursales
        </button>
        <button
          onClick={() => setActiveTab("series")}
          className={`${styles.tabBtn} ${activeTab === "series" ? styles.activeTab : ""}`}
        >
          <FileText className="w-5 h-5" /> Series de Facturación
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`${styles.tabBtn} ${activeTab === "usuarios" ? styles.activeTab : ""}`}
        >
          <Users className="w-5 h-5" /> Usuarios
        </button>
      </aside>

      {/* Área de Contenido */}
      <main className={styles.contentArea}>
        {/* TAB 1: EMPRESA PRINCIPAL */}
        {activeTab === "empresa" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className={styles.sectionTitle}>
              <SettingsIcon className="text-blue-600" /> Configuración de la
              Empresa
            </h2>
            <p className={styles.sectionSubtitle}>
              Estos datos se utilizarán para la emisión de comprobantes
              electrónicos (SUNAT).
            </p>

            <form onSubmit={saveCompanySettings}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>RUC</label>
                  <input
                    type="text"
                    name="ruc"
                    className={styles.input}
                    value={companyData.ruc}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Razón Social</label>
                  <input
                    type="text"
                    name="razonSocial"
                    className={styles.input}
                    value={companyData.razonSocial}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre Comercial</label>
                  <input
                    type="text"
                    name="nombreComercial"
                    className={styles.input}
                    value={companyData.nombreComercial}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Dirección Fiscal</label>
                  <input
                    type="text"
                    name="direccionFiscal"
                    className={styles.input}
                    value={companyData.direccionFiscal}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>
                    Cuentas Bancarias (Visible en PDF de Factura)
                  </label>
                  <textarea
                    name="datosBancarios"
                    className={styles.input}
                    value={companyData.datosBancarios}
                    onChange={handleCompanyChange}
                    rows={2}
                  ></textarea>
                </div>
                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>
                    Mensaje de Despedida (Pie de página)
                  </label>
                  <input
                    type="text"
                    name="mensajeDespedidaPie"
                    className={styles.input}
                    value={companyData.mensajeDespedidaPie}
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>
              <button type="submit" className={styles.btnPrimary}>
                <Save className="w-5 h-5" /> Guardar Cambios
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SUCURSALES */}
        {activeTab === "sucursales" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className={styles.sectionTitle}>
              <Store className="text-blue-600" /> Establecimientos Anexos
            </h2>
            <p className={styles.sectionSubtitle}>
              Sucursales registradas en SUNAT asociadas a tu RUC principal.
            </p>
            <div className={styles.cardGrid}>
              {branchesData.map((branch) => (
                <div key={branch.id} className={styles.infoCard}>
                  <div className={styles.cardBadge}>{branch.codigoBase}</div>
                  <h4 className={styles.cardTitle}>{branch.nombre}</h4>
                  <p className="flex items-start gap-1 text-xs text-slate-500 mt-2">
                    <MapPin className="w-4 h-4 shrink-0" /> {branch.direccion}
                  </p>
                </div>
              ))}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-500 cursor-pointer transition-colors min-h-[120px]">
                <span className="text-3xl">+</span>
                <span className="text-sm font-semibold mt-1">
                  Añadir Sucursal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERIES DE FACTURACIÓN */}
        {activeTab === "series" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className={styles.sectionTitle}>
              <FileText className="text-blue-600" /> Series de Comprobantes
            </h2>
            <p className={styles.sectionSubtitle}>
              Control de correlativos para la emisión electrónica por sucursal.
            </p>
            <div className={styles.cardGrid}>
              {seriesData.map((serie) => (
                <div key={serie.id} className={styles.infoCard}>
                  <div
                    className={`${styles.cardBadge} ${serie.tipoDocumento === "FACTURA" ? "text-blue-600 bg-blue-50 border-blue-200" : "text-indigo-600 bg-indigo-50 border-indigo-200"}`}
                  >
                    {serie.tipoDocumento}
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 mt-4 mb-1">
                    {serie.serie}
                  </h4>
                  <p className={styles.cardText}>
                    Correlativo actual:{" "}
                    <strong className="text-blue-600">
                      {String(serie.correlativoActual).padStart(6, "0")}
                    </strong>
                  </p>
                  <p className="text-xs text-slate-400 mt-2 border-t border-slate-200 pt-2">
                    Asignada a:{" "}
                    {branchesData.find((b) => b.id === serie.branchId)?.nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: USUARIOS */}
        {activeTab === "usuarios" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className={styles.sectionTitle}>
              <Users className="text-blue-600" /> Cuentas de Acceso
            </h2>
            <p className={styles.sectionSubtitle}>
              Personal autorizado para operar el sistema offline-first.
            </p>
            <div className={styles.cardGrid}>
              {usersData.map((user) => (
                <div
                  key={user.id}
                  className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{user.nombre}</h4>
                    <p className="text-xs text-slate-500 mb-1">{user.email}</p>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                      {user.rol}
                    </span>
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
