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
    productsList,
    handleSaveVehicle,
    handleDeleteVehicle,
    saveUsualProducts,
  } = useVehicles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Flota de Vehículos</h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus className={styles.iconLarge} /> Nuevo Vehículo
        </button>
      </div>

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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Placa / Vehículo</th>
              <th>Cliente / Chofer</th>
              <th>Kilometraje</th>
              <th>Notas</th>
              <th className={styles.tableCellCenter}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <tr key={vehicle.id} className={styles.tableRow}>
                  <td>
                    <strong className={styles.vehiclePlaca}>
                      {vehicle.licensePlate}
                    </strong>
                    <span className={styles.vehicleDetails}>
                      {vehicle.brand} {vehicle.model}{" "}
                      {vehicle.year ? `(${vehicle.year})` : ""}
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
                      Act: {(vehicle.kmActual || 0).toLocaleString()} km
                    </span>
                    <span
                      className={`${styles.kmNextBadgeBase} ${
                        (vehicle.kmActual || 0) >=
                        (vehicle.kmProximo || 0) - 1000
                          ? styles.kmNextBadgeAlert
                          : styles.kmNextBadgeNormal
                      }`}
                    >
                      Próx: {(vehicle.kmProximo || 0).toLocaleString()} km
                      {(vehicle.kmActual || 0) >=
                        (vehicle.kmProximo || 0) - 1000 && (
                        <AlertTriangle className={styles.kmAlertIcon} />
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={styles.notesText} title={vehicle.notas}>
                      {vehicle.notas || "-"}
                    </span>
                  </td>
                  <td className={styles.tableCellCenter}>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Expediente / Ficha Técnica"
                      >
                        <Eye className={styles.iconMedium} />
                      </button>

                      <button
                        onClick={() => openModal("edit", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar Datos"
                      >
                        <Edit2 className={styles.iconSmall} />
                      </button>
                      <button
                        onClick={() => openModal("delete", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar Vehículo"
                      >
                        <Trash2 className={styles.iconSmall} />
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

      <VehicleDetailsModal
        isOpen={activeModal === "details"}
        onClose={closeModal}
        vehicle={selectedVehicle}
        productsList={productsList}
        onEmitFactura={handleEmitirFactura}
        onSavePreferences={saveUsualProducts}
      />

      <VehicleFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        mode={activeModal as any}
        vehicle={activeModal === "edit" ? selectedVehicle : null}
        customers={customersList}
        onClose={closeModal}
        onSave={handleSaveVehicle}
      />

      <VehicleDeleteModal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        vehicle={selectedVehicle}
        onConfirm={handleDeleteVehicle}
      />
    </div>
  );
};
