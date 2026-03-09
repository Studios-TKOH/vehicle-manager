import React from "react";
import { FileText, Edit2, Trash2 } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import { useSeriesSettings } from "@hooks/settings/useSeriesSettings";
import { SeriesFormModal } from "./SeriesFormModal";
import { SeriesDeleteModal } from "./SeriesDeleteModal";
import { NoBranchWarningModal } from "../settings/NoBranchWarningModal";

interface Props {
  changeTab: (tab: "empresa" | "sucursales" | "series" | "usuarios") => void;
}

export const SeriesTab: React.FC<Props> = ({ changeTab }) => {
  const {
    series,
    branches,
    activeModal,
    selectedSeries,
    openModal,
    closeModal,
    addSeries,
    updateSeries,
    deleteSeries,
  } = useSeriesSettings();

  const handleSave = async (data: any) => {
    if (activeModal === "add") {
      await addSeries(data);
    } else if (activeModal === "edit" && selectedSeries) {
      await updateSeries(selectedSeries.id, data);
    }
  };

  const getDocTypeName = (docType: string) => {
    switch (docType) {
      case "01":
        return "FACTURA";
      case "03":
        return "BOLETA";
      case "07":
        return "N. CRÉDITO";
      case "08":
        return "N. DÉBITO";
      case "PR":
        return "PROFORMA";
      default:
        return "OTRO";
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>
        <FileText className={styles.iconBlue} /> Series de Comprobantes
      </h2>
      <p className={styles.sectionSubtitle}>
        Control de correlativos para la emisión electrónica por sucursal.
      </p>

      <div className={styles.cardGrid}>
        {series.map((s) => {
          const branchName =
            branches.find((b) => b.id === s.branchId)?.nombre ||
            "Sucursal Desconocida";

          return (
            <div key={s.id} className={styles.infoCard}>
              <div
                className={`${styles.cardBadge} ${s.docType === "01" ? styles.badgeFactura : styles.badgeBoleta}`}
              >
                {getDocTypeName(s.docType)}
              </div>

              <h4 className={styles.serieBigText}>{s.series}</h4>

              <p className={styles.cardText}>
                Correlativo actual:{" "}
                <strong className={styles.serieNumber}>
                  {String(s.nextCorrelative - 1).padStart(6, "0")}
                </strong>
              </p>

              <div
                className={styles.cardFooter}
                style={{ marginTop: "1rem", paddingTop: "1rem" }}
              >
                <span
                  className={styles.cardText}
                  style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                >
                  {branchName}
                </span>
                <div className={styles.cardActionGroup}>
                  <button
                    className={styles.iconBtnSmall}
                    onClick={() => openModal("edit", s)}
                    title="Editar Serie"
                  >
                    <Edit2 className={styles.iconSmall} />
                  </button>
                  <button
                    className={styles.iconBtnSmallDanger}
                    onClick={() => openModal("delete", s)}
                    title="Eliminar Serie"
                  >
                    <Trash2 className={styles.iconSmall} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Botón de Agregar */}
        <div className={styles.addCardBtn} onClick={() => openModal("add")}>
          <span className={styles.addCardIcon}>+</span>
          <span className={styles.addCardText}>Añadir Serie</span>
        </div>
      </div>

      {/* Modales */}
      <NoBranchWarningModal
        isOpen={activeModal === "warning"}
        onClose={closeModal}
        onNavigateToBranches={() => {
          closeModal();
          changeTab("sucursales"); // Cambia a la pestaña de sucursales
        }}
      />

      <SeriesFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        mode={activeModal as "add" | "edit"}
        seriesItem={selectedSeries}
        branches={branches}
        onClose={closeModal}
        onSave={handleSave}
      />

      <SeriesDeleteModal
        isOpen={activeModal === "delete"}
        seriesItem={selectedSeries}
        onClose={closeModal}
        onConfirm={() => {
          if (selectedSeries) deleteSeries(selectedSeries.id);
        }}
      />
    </div>
  );
};
