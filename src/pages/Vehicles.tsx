import { useVehicles } from "@hooks/useVehicles";
import styles from "@styles/modules/vehicles.module.css";
import {
  Search,
  Plus,
  Building2,
  User,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { VehicleDetailsModal } from "@components/vehicles/VehicleDetailsModal";
import { VehicleFormModal } from "@components/vehicles/VehicleFormModal";
import { VehicleDeleteModal } from "@components/vehicles/VehicleDeleteModal";

export const Vehicles = () => {
  const {
    searchTerm,
    handleSearch,
    currentVehicles,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    totalItems,
    activeModal,
    openModal,
    closeModal,
    selectedVehicle,
    handleEmitirFactura,
    customersList,
    handleSaveVehicle,
    handleDeleteVehicle,
  } = useVehicles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Flota de Vehículos</h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus className="w-5 h-5 shrink-0" /> Nuevo Vehículo
        </button>
      </div>

      {/* Controles: Búsqueda y Paginación */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por placa, cliente o modelo..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.paginationSelect}>
          <label>Mostrar</label>
          <select
            className={styles.selectInput}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <label>registros</label>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Placa / Vehículo</th>
              <th>Cliente / Chofer</th>
              <th>Kilometraje</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <tr key={vehicle.id} className={styles.tableRow}>
                  <td>
                    <strong className={styles.vehiclePlaca}>
                      {vehicle.placa}
                    </strong>
                    <span className={styles.vehicleDetails}>
                      {vehicle.marca} {vehicle.modelo} ({vehicle.anio})
                    </span>
                  </td>
                  <td>
                    <span className={styles.customerInfo}>
                      <Building2 className={styles.customerIcon} />{" "}
                      {vehicle.clienteNombre}
                    </span>
                    <span className={styles.driverInfo}>
                      <User className={styles.driverIcon} />{" "}
                      {vehicle.choferNombre}
                    </span>
                  </td>
                  <td>
                    <span className={styles.kmActualBadge}>
                      Act: {vehicle.kmActual.toLocaleString()} km
                    </span>
                    <span
                      className={`${styles.kmNextBadgeBase} ${
                        vehicle.kmActual >= vehicle.kmProximo - 1000
                          ? styles.kmNextBadgeAlert
                          : styles.kmNextBadgeNormal
                      }`}
                    >
                      Próx: {vehicle.kmProximo.toLocaleString()} km
                      {vehicle.kmActual >= vehicle.kmProximo - 1000 && (
                        <AlertTriangle className={styles.kmAlertIcon} />
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={styles.notesText} title={vehicle.notas}>
                      {vehicle.notas || "-"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Detalles e Historial"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar Datos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar Vehículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.tableEmptyRow}>
                  <div className={styles.tableEmptyState}>
                    <Search className={styles.tableEmptyIcon} />
                    <span className={styles.tableEmptyText}>
                      No se encontraron vehículos.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Inferior */}
      <div className={styles.paginationContainer}>
        <span className={styles.paginationInfo}>
          Mostrando {currentVehicles.length} de {totalItems} registros
        </span>
        <div className={styles.paginationControls}>
          <button
            className={styles.btnSecondary}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>

          <span className={styles.paginationCurrentPage}>
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            className={styles.btnSecondary}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* ================= MODALES EXTERNALIZADOS ================= */}

      {activeModal === "details" && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={closeModal}
          onEmitFactura={handleEmitirFactura}
        />
      )}

      {(activeModal === "add" || activeModal === "edit") && (
        <VehicleFormModal
          vehicle={activeModal === "edit" ? selectedVehicle : null}
          customers={customersList}
          onClose={closeModal}
          onSave={handleSaveVehicle}
        />
      )}

      {activeModal === "delete" && (
        <VehicleDeleteModal
          vehicle={selectedVehicle}
          onClose={closeModal}
          onConfirm={handleDeleteVehicle}
        />
      )}
    </div>
  );
};
