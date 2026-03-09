import React from "react";
import { Users, Edit2, Trash2 } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import { useUsersSettings } from "@hooks/settings/useUsersSettings";
import { UserFormModal } from "./UserFormModal";
import { UserDeleteModal } from "./UserDeleteModal";
import { NoBranchWarningModal } from "../settings/NoBranchWarningModal";

interface Props {
  changeTab: (tab: "empresa" | "sucursales" | "series" | "usuarios") => void;
}

export const UsersTab: React.FC<Props> = ({ changeTab }) => {
  const {
    users,
    branches,
    activeModal,
    selectedUser,
    openModal,
    closeModal,
    addUser,
    updateUser,
    deleteUser,
  } = useUsersSettings();

  const handleSave = async (data: any, tempPassword?: string) => {
    if (activeModal === "add") {
      await addUser(data, tempPassword);
    } else if (activeModal === "edit" && selectedUser) {
      await updateUser(selectedUser.id, data);
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionTitle}>
        <Users className={styles.iconBlue} /> Cuentas de Acceso
      </h2>
      <p className={styles.sectionSubtitle}>
        Personal autorizado para operar el sistema offline-first.
      </p>

      <div className={styles.cardGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userInfoWrapper}>
              <div className={styles.userAvatarBox}>
                <Users className={styles.userAvatarIcon} />
              </div>
              <div>
                <h4 className={styles.userName}>{user.nombre}</h4>
                <p className={styles.userEmail}>{user.email}</p>
                <span className={styles.userRoleBadge}>{user.rol}</span>
              </div>
            </div>

            <div className={styles.userActionGroup}>
              <button
                className={styles.iconBtnSmall}
                onClick={() => openModal("edit", user)}
                title="Editar Usuario"
              >
                <Edit2 className={styles.iconSmall} />
              </button>
              <button
                className={styles.iconBtnSmallDanger}
                onClick={() => openModal("delete", user)}
                title="Desactivar Usuario"
              >
                <Trash2 className={styles.iconSmall} />
              </button>
            </div>
          </div>
        ))}

        {/* Botón de Agregar */}
        <div className={styles.addCardBtn} onClick={() => openModal("add")}>
          <span className={styles.addCardIcon}>+</span>
          <span className={styles.addCardText}>Añadir Usuario</span>
        </div>
      </div>

      {/* Modales */}
      <NoBranchWarningModal
        isOpen={activeModal === "warning"}
        onClose={closeModal}
        onNavigateToBranches={() => {
          closeModal();
          changeTab("sucursales");
        }}
      />

      <UserFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        mode={activeModal as "add" | "edit"}
        userItem={selectedUser}
        branches={branches}
        onClose={closeModal}
        onSave={handleSave}
      />

      <UserDeleteModal
        isOpen={activeModal === "delete"}
        userItem={selectedUser}
        onClose={closeModal}
        onConfirm={() => {
          if (selectedUser) deleteUser(selectedUser.id);
        }}
      />
    </div>
  );
};
