import React, { useState, useEffect } from "react";
import { useCustomers } from "../hooks/useCustomers";
import styles from "../styles/modules/Customers.module.css";
import {
  Search,
  Plus,
  Users,
  Eye,
  Edit2,
  Trash2,
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export const Customers = () => {
  const {
    searchTerm,
    handleSearch,
    currentCustomers,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    totalItems,
    activeModal,
    openModal,
    closeModal,
    selectedCustomer,
    fetchDecolectaData,
    isSearchingApi,
  } = useCustomers();

  // Estado local para el formulario de Agregar/Editar
  const [formData, setFormData] = useState({
    tipoDocumentoIdentidad: "RUC",
    numeroDocumento: "",
    nombreRazonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [apiSuccess, setApiSuccess] = useState(false);

  // Inicializar formulario al abrir el modal de Edición
  useEffect(() => {
    if (activeModal === "edit" && selectedCustomer) {
      setFormData(selectedCustomer);
    } else if (activeModal === "add") {
      setFormData({
        tipoDocumentoIdentidad: "RUC",
        numeroDocumento: "",
        nombreRazonSocial: "",
        direccion: "",
        telefono: "",
        email: "",
      });
      setApiSuccess(false);
    }
  }, [activeModal, selectedCustomer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiSuccess(false); // Resetear el check verde si el usuario modifica el texto manualmente
  };

  // Función que llama a la API de Decolecta
  const handleDecolectaSearch = async () => {
    const data = await fetchDecolectaData(
      formData.tipoDocumentoIdentidad,
      formData.numeroDocumento,
    );
    if (data) {
      setFormData((prev) => ({
        ...prev,
        nombreRazonSocial: data.nombreRazonSocial || prev.nombreRazonSocial,
        direccion: data.direccion || prev.direccion,
      }));
      setApiSuccess(true);
    } else {
      alert("Documento no encontrado o API no disponible.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users className="text-blue-600" /> Directorio de Clientes
        </h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus className="w-5 h-5" /> Registrar Cliente
        </button>
      </div>

      {/* Controles: Búsqueda y Paginación */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por documento, nombre o correo..."
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
              <th>Documento</th>
              <th>Cliente / Razón Social</th>
              <th>Contacto</th>
              <th>Vehículos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td>
                    <span
                      className={`${styles.docTypeBadge} ${customer.tipoDocumentoIdentidad === "RUC" ? styles.badgeRuc : styles.badgeDni}`}
                    >
                      {customer.tipoDocumentoIdentidad}
                    </span>
                    <strong className="text-slate-700">
                      {customer.numeroDocumento}
                    </strong>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {customer.tipoDocumentoIdentidad === "RUC" ? (
                        <Building2 className="w-4 h-4 text-slate-400" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-semibold text-slate-800">
                        {customer.nombreRazonSocial}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1 mt-1 text-xs text-slate-500 truncate max-w-[250px]"
                      title={customer.direccion}
                    >
                      <MapPin className="w-3 h-3" />{" "}
                      {customer.direccion || "Sin dirección registrada"}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-slate-600 flex flex-col gap-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />{" "}
                        {customer.telefono || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {customer.email || "-"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
                      <Truck className="w-4 h-4 text-blue-600" />
                      {customer.totalVehiculosRelacionados} Asociados
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", customer)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", customer)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", customer)}
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
                  No se encontraron clientes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Inferior */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-slate-500">
          Mostrando {currentCustomers.length} de {totalItems} registros
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
      {activeModal === "details" && selectedCustomer && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <User className="text-blue-600" /> Ficha del Cliente
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Tarjeta de Identificación */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white mb-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {selectedCustomer.tipoDocumentoIdentidad}
                    </span>
                    <h3 className="text-2xl font-bold mt-3 mb-1">
                      {selectedCustomer.nombreRazonSocial}
                    </h3>
                    <p className="text-slate-300 font-mono text-lg">
                      {selectedCustomer.numeroDocumento}
                    </p>
                  </div>
                  {selectedCustomer.tipoDocumentoIdentidad === "RUC" ? (
                    <Building2 className="w-12 h-12 text-slate-400 opacity-50" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400 opacity-50" />
                  )}
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border border-slate-200 p-4 rounded-xl flex items-start gap-3">
                  <MapPin className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Dirección Fiscal
                    </p>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedCustomer.direccion || "No registrada"}
                    </p>
                  </div>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl flex items-start gap-3">
                  <Phone className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Contacto
                    </p>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedCustomer.telefono || "Sin teléfono"}
                    </p>
                    <p className="text-sm text-slate-700">
                      {selectedCustomer.email || "Sin correo electrónico"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flota de Vehículos Asociada */}
              <h4 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                Flota de Vehículos Asociada
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCustomer.vehiculosPropios?.map((v: any) => (
                  <div
                    key={v.id}
                    className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-blue-900">{v.placa}</p>
                      <p className="text-xs text-blue-700">
                        {v.marca} {v.modelo} • Propio
                      </p>
                    </div>
                    <Truck className="text-blue-400 opacity-50 w-8 h-8" />
                  </div>
                ))}
                {selectedCustomer.vehiculosConducidos?.map((v: any) => (
                  <div
                    key={v.id}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-700">{v.placa}</p>
                      <p className="text-xs text-slate-500">
                        {v.marca} {v.modelo} • Conductor Habitual
                      </p>
                    </div>
                    <User className="text-slate-400 opacity-50 w-8 h-8" />
                  </div>
                ))}
                {selectedCustomer.totalVehiculosRelacionados === 0 && (
                  <p className="text-sm text-slate-500 col-span-2 italic">
                    No tiene vehículos asociados actualmente.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR / EDITAR (CON INTEGRACIÓN DECOLECTA) */}
      {(activeModal === "add" || activeModal === "edit") && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalContent} max-w-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {activeModal === "add"
                  ? "Registrar Nuevo Cliente"
                  : "Editar Cliente"}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <form className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo de Documento</label>
                  <select
                    name="tipoDocumentoIdentidad"
                    className={styles.input}
                    value={formData.tipoDocumentoIdentidad}
                    onChange={handleInputChange}
                  >
                    <option value="RUC">
                      RUC (Empresa / Persona con Negocio)
                    </option>
                    <option value="DNI">DNI (Persona Natural)</option>
                    <option value="CE">Carnet de Extranjería</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Número de Documento
                    {apiSuccess && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validado
                      </span>
                    )}
                  </label>
                  <div className={styles.apiSearchWrapper}>
                    <input
                      type="text"
                      name="numeroDocumento"
                      className={`${styles.input} flex-1`}
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      placeholder={
                        formData.tipoDocumentoIdentidad === "RUC"
                          ? "Ej: 20123456789"
                          : "Ej: 76543210"
                      }
                      maxLength={
                        formData.tipoDocumentoIdentidad === "RUC" ? 11 : 8
                      }
                    />
                    <button
                      type="button"
                      className={styles.apiBtn}
                      onClick={handleDecolectaSearch}
                      disabled={
                        isSearchingApi || formData.numeroDocumento.length < 8
                      }
                    >
                      {isSearchingApi ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-1" /> SUNAT
                        </>
                      )}
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 mt-1">
                    Conectado con Decolecta API para autocompletar.
                  </span>
                </div>

                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>
                    Razón Social / Nombres y Apellidos
                  </label>
                  <input
                    type="text"
                    name="nombreRazonSocial"
                    className={styles.input}
                    value={formData.nombreRazonSocial}
                    onChange={handleInputChange}
                    placeholder="Nombre completo de la empresa o persona"
                  />
                </div>

                <div className={`${styles.formGroup} md:col-span-2`}>
                  <label className={styles.label}>
                    Dirección Fiscal / Domicilio
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    className={styles.input}
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Av. Las Palmeras 123..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono de Contacto</label>
                  <input
                    type="text"
                    name="telefono"
                    className={styles.input}
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 999 888 777"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Correo Electrónico (Para Facturas)
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="facturacion@empresa.com"
                  />
                </div>
              </form>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>
                Cancelar
              </button>
              <button className={styles.btnPrimary} onClick={closeModal}>
                {activeModal === "add"
                  ? "Guardar Cliente"
                  : "Actualizar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR */}
      {activeModal === "delete" && selectedCustomer && (
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
                  ¿Eliminar Cliente?
                </h3>
                <p className="text-slate-600 mb-6">
                  Estás a punto de eliminar a{" "}
                  <strong className="text-slate-800">
                    {selectedCustomer.nombreRazonSocial}
                  </strong>
                  . Sus facturas y vehículos se mantendrán en el historial, pero
                  el cliente ya no aparecerá en búsquedas.
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
