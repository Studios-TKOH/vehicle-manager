import { Store, MapPin, Edit2, Trash2 } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import { useBranchesSettings } from "@hooks/settings/useBranchesSettings";
import { BranchFormModal } from "./BranchFormModal";
import { BranchDeleteModal } from "./BranchDeleteModal";

export const BranchesTab = () => {
  const {
    branches,
    activeModal,
    selectedBranch,
    openModal,
    closeModal,
    addBranch,
    updateBranch,
    deleteBranch,
  } = useBranchesSettings();

  const handleSave = async (data: any) => {
    if (activeModal === "add") {
      await addBranch(data);
    } else if (activeModal === "edit" && selectedBranch) {
      await updateBranch(selectedBranch.id, data);
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>
        <Store className={styles.iconBlue} /> Establecimientos Anexos
      </h2>
      <p className={styles.sectionSubtitle}>
        Sucursales registradas en SUNAT asociadas a tu RUC principal.
      </p>

      <div className={styles.cardGrid}>
        {branches.map((branch) => (
          <div key={branch.id} className={styles.infoCard}>
            <div className={styles.cardBadge}>{branch.codigoBase}</div>
            <h4 className={styles.cardTitle}>{branch.nombre}</h4>

            <p className={styles.branchAddress}>
              <MapPin className={styles.iconSmall} /> {branch.direccion}
            </p>

            {/* Novedad: Botones de Acción en el Footer de la tarjeta */}
            <div className={styles.cardFooter}>
              <span className={styles.cardText}>
                SUNAT: {branch.sunatCodigoSucursal || "N/A"}
              </span>
              <div className={styles.cardActionGroup}>
                <button
                  className={styles.iconBtnSmall}
                  onClick={() => openModal("edit", branch)}
                  title="Editar Sucursal"
                >
                  <Edit2 className={styles.iconSmall} />
                </button>
                <button
                  className={styles.iconBtnSmallDanger}
                  onClick={() => openModal("delete", branch)}
                  title="Eliminar Sucursal"
                >
                  <Trash2 className={styles.iconSmall} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Botón de Agregar */}
        <div className={styles.addCardBtn} onClick={() => openModal("add")}>
          <span className={styles.addCardIcon}>+</span>
          <span className={styles.addCardText}>Añadir Sucursal</span>
        </div>
      </div>

      <BranchFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        mode={activeModal as "add" | "edit"}
        branch={selectedBranch}
        onClose={closeModal}
        onSave={handleSave}
      />

      <BranchDeleteModal
        isOpen={activeModal === "delete"}
        branch={selectedBranch}
        onClose={closeModal}
        onConfirm={() => {
          if (selectedBranch) deleteBranch(selectedBranch.id);
        }}
      />
    </div>
  );
};
