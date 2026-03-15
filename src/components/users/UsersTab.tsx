import React from "react";
import { Users, Edit2, Trash2, ShieldCheck } from "lucide-react";
import styles from "@styles/modules/Settings.module.css";
import { useUsersSettings } from "@hooks/settings/useUsersSettings";
import { UserFormModal } from "./UserFormModal";
import { UserDeleteModal } from "./UserDeleteModal";
import { NoBranchWarningModal } from "../settings/NoBranchWarningModal";
import { useAuth } from "@hooks/useAuth";

interface Props {
  changeTab: (tab: "empresa" | "sucursales" | "series" | "usuarios") => void;
}

export const UsersTab: React.FC<Props> = ({ changeTab }) => {
  const { user: currentUser } = useAuth();
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
        {users.map((user) => {
          const isMe = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              className={`${styles.userCard} ${isMe ? styles.userCardIsMe : ""}`}
            >
              <div className={styles.userInfoWrapper}>
                <div
                  className={
                    isMe ? styles.userAvatarBoxIsMe : styles.userAvatarBox
                  }
                >
                  {isMe ? (
                    <ShieldCheck size={24} />
                  ) : (
                    <Users className={styles.userAvatarIcon} />
                  )}
                </div>
                <div>
                  <h4 className={styles.userName}>
                    {user.nombre}
                    {isMe && <span className={styles.userMeBadge}>Tú</span>}
                  </h4>
                  <p className={styles.userEmail}>{user.email}</p>
                  <span className={styles.userRoleBadge}>{user.rol}</span>
                </div>
              </div>

              <div className={styles.userActionGroup}>
                <button
                  className={styles.iconBtnSmall}
                  onClick={() => openModal("edit", user)}
                  title={isMe ? "Mi Perfil" : "Editar Usuario"}
                >
                  <Edit2 className={styles.iconSmall} />
                </button>

                {!isMe && (
                  <button
                    className={styles.iconBtnSmallDanger}
                    onClick={() => openModal("delete", user)}
                    title="Desactivar Usuario"
                  >
                    <Trash2 className={styles.iconSmall} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className={styles.addCardBtn} onClick={() => openModal("add")}>
          <span className={styles.addCardIcon}>+</span>
          <span className={styles.addCardText}>Añadir Usuario</span>
        </div>
      </div>

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
        currentUserId={currentUser?.id}
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
