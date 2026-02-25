import { useVehicles } from "../hooks/useVehicles";
import styles from "../styles/modules/vehicles.module.css";
import {
  Search,
  Plus,
  Building2,
  User,
  Eye,
  Edit2,
  Trash2,
  X,
  Truck,
  Receipt,
  Wrench,
  AlertTriangle,
} from "lucide-react";

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
  } = useVehicles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Flota de Vehículos</h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus className="w-5 h-5" /> Nuevo Vehículo
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
                <tr
                  key={vehicle.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td>
                    <strong className="text-slate-800 text-base">
                      {vehicle.placa}
                    </strong>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      {vehicle.marca} {vehicle.modelo} ({vehicle.anio})
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Building2 className="w-4 h-4 text-slate-400" />{" "}
                      {vehicle.clienteNombre}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <User className="w-3.5 h-3.5" /> {vehicle.choferNombre}
                    </span>
                  </td>
                  <td>
                    <span className="block text-sm font-medium text-slate-700">
                      Act: {vehicle.kmActual.toLocaleString()} km
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs mt-1 ${vehicle.kmActual >= vehicle.kmProximo - 1000 ? "text-orange-600 font-bold" : "text-slate-500"}`}
                    >
                      Próx: {vehicle.kmProximo.toLocaleString()} km
                      {vehicle.kmActual >= vehicle.kmProximo - 1000 && (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                    </span>
                  </td>
                  <td>
                    <span
                      className="text-sm text-slate-600 truncate max-w-[150px] inline-block"
                      title={vehicle.notas}
                    >
                      {vehicle.notas || "-"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", vehicle)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  No se encontraron vehículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Inferior */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-slate-500">
          Mostrando {currentVehicles.length} de {totalItems} registros
        </span>
        <div className="flex gap-2">
          <button
            className={styles.btnSecondary}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
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

      {/* ================= MODALES ================= */}

      {/* MODAL: VER DETALLES */}
      {activeModal === "details" && selectedVehicle && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Truck className="text-blue-600" /> Detalle del Vehículo:{" "}
                {selectedVehicle.placa}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Info General */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Empresa / Propietario
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedVehicle.clienteNombre}
                  </p>
                  <p className="text-sm text-slate-600">
                    RUC/DNI: {selectedVehicle.clienteDocumento}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Características
                  </p>
                  <p className="font-semibold text-slate-800">
                    {selectedVehicle.marca} {selectedVehicle.modelo}
                  </p>
                  <p className="text-sm text-slate-600">
                    Año: {selectedVehicle.anio} | Color:{" "}
                    {selectedVehicle.color || "N/A"}
                  </p>
                </div>
              </div>

              {/* Historial de Servicios */}
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-500" /> Historial de
                Servicios
              </h3>

              {selectedVehicle.historial &&
              selectedVehicle.historial.length > 0 ? (
                <div className="space-y-4">
                  {selectedVehicle.historial.map((sale: any) => (
                    <div
                      key={sale.id}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-slate-100 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                        <div>
                          <span className="font-bold text-slate-800">
                            {sale.tipoComprobante}: {sale.serie}-
                            {sale.correlativo}
                          </span>
                          <span className="text-xs text-slate-500 ml-3">
                            {new Date(sale.fechaEmision).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="font-bold text-blue-700">
                          S/ {sale.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Productos utilizados:
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {sale.items.map((item: any) => (
                            <li key={item.id}>
                              {item.cantidad}x {item.productName}
                              <span className="text-slate-400 ml-2">
                                (S/ {item.precioUnitario.toFixed(2)} c/u)
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 text-xs text-slate-500 flex gap-4">
                          <span>KM Ingreso: {sale.kilometrajeIngreso}</span>
                          <span>Próximo Cambio: {sale.proximoCambioKm}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                  No hay servicios registrados para este vehículo.
                </p>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cerrar
              </button>
              {/* BOTÓN ESTRELLA: Conecta con el módulo de ventas */}
              <button
                className={styles.btnPrimary}
                onClick={() => handleEmitirFactura(selectedVehicle)}
              >
                <Receipt className="w-5 h-5" /> Emitir Boleta / Factura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR / EDITAR */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {activeModal === "add"
                  ? "Registrar Nuevo Vehículo"
                  : `Editar Vehículo: ${selectedVehicle?.placa}`}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <form className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Placa</label>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={selectedVehicle?.placa}
                    placeholder="Ej: ABC-123"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Marca</label>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={selectedVehicle?.marca}
                    placeholder="Ej: TOYOTA"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Modelo</label>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={selectedVehicle?.modelo}
                    placeholder="Ej: HILUX"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Año</label>
                  <input
                    type="number"
                    className={styles.input}
                    defaultValue={selectedVehicle?.anio}
                    placeholder="Ej: 2024"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Color</label>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={selectedVehicle?.color}
                    placeholder="Ej: Blanco"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kilometraje Inicial</label>
                  <input
                    type="number"
                    className={styles.input}
                    defaultValue={selectedVehicle?.kilometrajeActual}
                    placeholder="Ej: 45000"
                  />
                </div>
                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>Notas / Preferencias</label>
                  <textarea
                    className={styles.input}
                    rows={3}
                    defaultValue={selectedVehicle?.notas}
                    placeholder="Preferencias del cliente..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cancelar
              </button>
              <button className={styles.btnPrimary} onClick={closeModal}>
                {activeModal === "add"
                  ? "Guardar Vehículo"
                  : "Actualizar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR */}
      {activeModal === "delete" && selectedVehicle && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalContent} max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalBody}>
              <div className="text-center pt-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  ¿Eliminar Vehículo?
                </h3>
                <p className="text-slate-600 mb-6">
                  Estás a punto de eliminar el vehículo con placa{" "}
                  <strong className="text-slate-800">
                    {selectedVehicle.placa}
                  </strong>
                  . Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center gap-3">
                  <button className={styles.btnSecondary} onClick={closeModal}>
                    Cancelar
                  </button>
                  <button className={styles.btnDanger} onClick={closeModal}>
                    Sí, Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
