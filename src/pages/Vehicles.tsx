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
  ClipboardList,
} from "lucide-react";
import { VehicleDetailsModal } from "@components/vehicles/VehicleDetailsModal";
import { VehicleFormModal } from "@components/vehicles/VehicleFormModal";
import { VehicleDeleteModal } from "@components/vehicles/VehicleDeleteModal";
import { VehicleUsualProductsModal } from "@components/vehicles/VehicleUsualProductsModal";

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
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <tr key={vehicle.id} className={styles.tableRow}>
                  <td>
                    {/* Variables mapeadas a la BD (Inglés) */}
                    <strong className={styles.vehiclePlaca}>
                      {vehicle.licensePlate}
                    </strong>
                    <span className={styles.vehicleDetails}>
                      {vehicle.brand} {vehicle.model}{" "}
                      {vehicle.year ? `(${vehicle.year})` : ""}
                    </span>
                  </td>
                  <td>
                    {/* Variables calculadas en useVehicles.ts */}
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
                        onClick={() => openModal("usualProducts", vehicle)}
                        className={`${styles.iconBtn} hover:bg-amber-50 text-amber-500`}
                        title="Ficha Técnica / Productos Habituales"
                      >
                        <ClipboardList className="w-4 h-4" />
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
      <VehicleDetailsModal
        isOpen={activeModal === "details"}
        onClose={closeModal}
        vehicle={selectedVehicle}
        onEmitFactura={handleEmitirFactura}
        onOpenUsualProducts={() => openModal("usualProducts", selectedVehicle)} // <-- Enviamos la acción
      />

      <VehicleUsualProductsModal
        isOpen={activeModal === "usualProducts"}
        onClose={closeModal}
        vehicle={selectedVehicle}
        productsList={productsList}
        onSave={saveUsualProducts}
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
