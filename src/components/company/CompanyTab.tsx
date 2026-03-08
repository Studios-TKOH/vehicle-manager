import { Settings as SettingsIcon, Save } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import { useCompanySettings } from "@hooks/settings/useCompanySettings";
import { SettingsSuccessModal } from "../settings/SettingsSuccessModal";

export const CompanyTab = () => {
  const {
    companyData,
    handleCompanyChange,
    saveCompanySettings,
    isSaving,
    showSuccessModal,
    setShowSuccessModal,
  } = useCompanySettings();

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>
        <SettingsIcon className={styles.iconBlue} /> Configuración de la Empresa
      </h2>
      <p className={styles.sectionSubtitle}>
        Estos datos se utilizarán para la emisión de comprobantes electrónicos
        (SUNAT).
      </p>

      <form onSubmit={saveCompanySettings}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>RUC</label>
            <input
              type="text"
              name="ruc"
              className={styles.input}
              value={companyData.ruc || ""}
              onChange={handleCompanyChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              className={styles.input}
              value={companyData.razonSocial || ""}
              onChange={handleCompanyChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre Comercial</label>
            <input
              type="text"
              name="nombreComercial"
              className={styles.input}
              value={companyData.nombreComercial || ""}
              onChange={handleCompanyChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Dirección Fiscal</label>
            <input
              type="text"
              name="direccionFiscal"
              className={styles.input}
              value={companyData.direccionFiscal || ""}
              onChange={handleCompanyChange}
            />
          </div>
          <div className={styles.formGroupWide}>
            <label className={styles.label}>
              Cuentas Bancarias (Visible en PDF de Factura)
            </label>
            <textarea
              name="datosBancarios"
              className={styles.input}
              value={companyData.datosBancarios || ""}
              onChange={handleCompanyChange}
              rows={2}
            ></textarea>
          </div>
          <div className={styles.formGroupWide}>
            <label className={styles.label}>
              Mensaje de Despedida (Pie de página)
            </label>
            <input
              type="text"
              name="mensajeDespedidaPie"
              className={styles.input}
              value={companyData.mensajeDespedidaPie || ""}
              onChange={handleCompanyChange}
            />
          </div>
        </div>
        <button type="submit" className={styles.btnPrimary} disabled={isSaving}>
          <Save className={styles.iconMedium} />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>

      {/* Modal de Éxito Inyectado Aquí */}
      <SettingsSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Empresa Actualizada!"
        message="Los datos fiscales de tu empresa se han guardado correctamente."
      />
    </div>
  );
};
