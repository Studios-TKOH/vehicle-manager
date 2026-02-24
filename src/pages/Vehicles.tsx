import React from "react";
import styles from "../styles/modules/vehicles.module.css";
import { useVehicles } from "../hooks/useVehicles";
import {
  Search,
  Plus,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
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
    expandedRow,
    toggleDetails,
  } = useVehicles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Flota de Vehículos</h1>
        <button className={styles.addButton}>
          <Plus className={styles.icon} />
          Nuevo Vehículo
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por placa, cliente, marca o modelo..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Tabla Principal */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Placa / Vehículo</th>
              <th>Cliente / Chofer</th>
              <th>Kilometraje</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <React.Fragment key={vehicle.id}>
                  <tr>
                    {/* Columna Placa y Modelo */}
                    <td>
                      <strong>{vehicle.placa}</strong>
                      <span className={styles.subText}>
                        {vehicle.marca} {vehicle.modelo} ({vehicle.anio})
                      </span>
                    </td>

                    {/* Columna Relaciones (Empresa y Chofer) */}
                    <td>
                      <span className={styles.entityText}>
                        <Building2 className={styles.icon} />
                        {vehicle.clienteEmpresa.razonSocial}
                      </span>
                      <span className={styles.subText}>
                        <User className={styles.icon} />
                        Chofer: {vehicle.chofer.nombre}
                      </span>
                    </td>

                    {/* Columna Kilometraje */}
                    <td>
                      <span className={styles.kmText}>
                        Actual: {vehicle.kilometrajeActual.toLocaleString()} km
                      </span>
                      <span
                        className={`${styles.subText} ${
                          vehicle.kilometrajeActual >=
                          vehicle.proximoMantenimiento - 1000
                            ? styles.kmWarning
                            : ""
                        }`}
                      >
                        {vehicle.kilometrajeActual >=
                          vehicle.proximoMantenimiento - 1000 && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        Próx: {vehicle.proximoMantenimiento.toLocaleString()} km
                      </span>
                    </td>

                    {/* Columna Estado */}
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          vehicle.estado === "ACTIVO"
                            ? styles.statusActive
                            : vehicle.estado === "MANTENIMIENTO"
                              ? styles.statusMaintenance
                              : styles.statusInactive
                        }`}
                      >
                        {vehicle.estado}
                      </span>
                    </td>

                    {/* Columna Acciones */}
                    <td>
                      <button
                        onClick={() => toggleDetails(vehicle.id)}
                        className={styles.detailsBtn}
                      >
                        {expandedRow === vehicle.id ? (
                          <>
                            Ocultar <ChevronUp className={styles.icon} />
                          </>
                        ) : (
                          <>
                            Ver Detalles <ChevronDown className={styles.icon} />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Fila Expandible (Detalles del Historial) */}
                  {expandedRow === vehicle.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={5}>
                        <div className={styles.detailsContent}>
                          <div className={styles.detailsGrid}>
                            {/* Sección: Información Legal */}
                            <div className={styles.detailSection}>
                              <h4>Información Legal</h4>
                              <p className={styles.subText}>
                                <strong>RUC Cliente:</strong>{" "}
                                {vehicle.clienteEmpresa.ruc}
                              </p>
                              <p className={styles.subText}>
                                <strong>DNI Chofer:</strong>{" "}
                                {vehicle.chofer.dni}
                              </p>
                              <p className={styles.subText}>
                                <strong>Licencia:</strong>{" "}
                                {vehicle.chofer.licencia}
                              </p>
                            </div>

                            {/* Sección: Historial de Servicios */}
                            <div className={styles.detailSection}>
                              <h4>Últimos Servicios Facturados</h4>
                              {vehicle.historialServicios.length > 0 ? (
                                <ul className={styles.historyList}>
                                  {vehicle.historialServicios.map(
                                    (servicio, index) => (
                                      <li
                                        key={index}
                                        className={styles.historyItem}
                                      >
                                        <strong>{servicio.fecha}</strong> -{" "}
                                        {servicio.tipo}
                                        <br />
                                        <span className={styles.subText}>
                                          Costo: S/{" "}
                                          {servicio.costoTotal.toFixed(2)}
                                        </span>
                                        <span className={styles.subText}>
                                          Productos:{" "}
                                          {servicio.productos.join(", ")}
                                        </span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                <p className={styles.subText}>
                                  No hay servicios registrados.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "3rem" }}
                  className="text-slate-500"
                >
                  No se encontraron vehículos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className={styles.pagination}>
        <span className={styles.subText}>
          Mostrando página {currentPage} de {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <button
            className={styles.pageBtn}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
