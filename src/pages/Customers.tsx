import { useState, useEffect } from "react";
import { useCustomers } from "@hooks/useCustomers";
import styles from "@styles/modules/customers.module.css";
import { Search, Plus, Users, Eye, Edit2, Trash2, Truck } from "lucide-react";
import { CustomerDetailsModal } from "@components/customers/CustomerDetailsModal";
import { CustomerFormModal } from "@components/customers/CustomerFormModal";
import { CustomerDeleteModal } from "@components/customers/CustomerDeleteModal";
import type { CustomerFormData } from "@/types/customers";

export const Customers = () => {
  const {
    searchTerm,
    handleSearch,
    currentCustomers,
    itemsPerPage,
    handleItemsPerPageChange,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
    activeModal,
    openModal,
    closeModal,
    selectedCustomer,
    fetchDecolectaData,
    isSearchingApi,
    addCustomer,
    updateCustomer,
  } = useCustomers();

  const [formData, setFormData] = useState<CustomerFormData>({
    tipoDocumentoIdentidad: "6",
    numeroDocumento: "",
    nombreRazonSocial: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [apiSuccess, setApiSuccess] = useState(false);

  useEffect(() => {
    if (activeModal === "edit" && selectedCustomer) {
      setFormData({
        tipoDocumentoIdentidad: selectedCustomer.identityDocType || "6",
        numeroDocumento: selectedCustomer.identityDocNumber || "",
        nombreRazonSocial: selectedCustomer.name || "",
        direccion: selectedCustomer.address || "",
        telefono: selectedCustomer.phone || "",
        email: selectedCustomer.email || "",
      });
    } else if (activeModal === "add") {
      setFormData({
        tipoDocumentoIdentidad: "6",
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
    setApiSuccess(false);
  };

  const handleSearchApi = async () => {
    const data = await fetchDecolectaData(
      formData.tipoDocumentoIdentidad,
      formData.numeroDocumento,
    );
    if (data) {
      setFormData((prev) => ({
        ...prev,
        nombreRazonSocial: data.name,
        direccion: data.address || "",
      }));
      setApiSuccess(true);
    }
  };

  const handleSaveCustomer = async () => {
    if (!formData.numeroDocumento || !formData.nombreRazonSocial) {
      alert("Por favor, llena los campos obligatorios (Documento y Nombre).");
      return;
    }

    const payload = {
      identityDocType: formData.tipoDocumentoIdentidad,
      identityDocNumber: formData.numeroDocumento,
      name: formData.nombreRazonSocial,
      address: formData.direccion || null,
      phone: formData.telefono || null,
      email: formData.email || null,
      isActive: true,
    };

    if (activeModal === "add") {
      await addCustomer(payload);
    } else if (activeModal === "edit" && selectedCustomer) {
      await updateCustomer(selectedCustomer.id, payload);
    }

    // (Opcional) si 'addCustomer' no cierra el modal por dentro, añadir esto... como fallback... atte. lavender
    // closeModal();
  };

  const handleConfirmDelete = () => {
    console.log("Eliminando cliente:", selectedCustomer?.id);
    closeModal();
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users className={styles.titleIcon} /> Directorio de Clientes
        </h1>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          <Plus size={20} /> REGISTRAR CLIENTE
        </button>
      </div>

      {/* CONTROLES (Búsqueda y Paginación) */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por documento o nombre..."
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

      {/* TABLA PRINCIPAL */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DOCUMENTO</th>
              <th>CLIENTE / RAZÓN SOCIAL</th>
              <th>CONTACTO</th>
              <th className={styles.tableCellCenter}>VEHÍCULOS</th>
              <th className={styles.tableCellCenter}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer: any) => (
                <tr key={customer.id} className={styles.tableRow}>
                  <td className={styles.tableCellDoc}>
                    {customer.identityDocNumber}
                  </td>
                  <td className={styles.tableCellName}>{customer.name}</td>

                  <td>
                    <div className={styles.contactWrapper}>
                      <span className={styles.contactPhone}>
                        {customer.phone || "---"}
                      </span>
                      <span className={styles.contactEmail}>
                        {customer.email || "---"}
                      </span>
                    </div>
                  </td>

                  <td className={styles.tableCellCenter}>
                    <button
                      onClick={() => openModal("details", customer)}
                      className={styles.vehicleCountBtn}
                    >
                      <Truck size={14} className={styles.vehicleCountIcon} />
                      {customer.totalVehiculosRelacionados}
                    </button>
                  </td>

                  <td className={styles.tableCellCenter}>
                    <div className={styles.actionGroup}>
                      <button
                        onClick={() => openModal("details", customer)}
                        className={`${styles.iconBtn} ${styles.iconBtnView}`}
                        title="Ver Expediente"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", customer)}
                        className={`${styles.iconBtn} ${styles.iconBtnEdit}`}
                        title="Editar Datos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("delete", customer)}
                        className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                        title="Eliminar Cliente"
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
                      No se encontraron clientes.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINACIÓN */}
      <div className={styles.paginationContainer}>
        <span className={styles.paginationInfo}>
          Mostrando {currentCustomers.length} de {totalItems} registros
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

      {/* MODALES */}
      <CustomerDetailsModal
        isOpen={activeModal === "details"}
        onClose={closeModal}
        customer={selectedCustomer}
      />

      <CustomerFormModal
        isOpen={activeModal === "add" || activeModal === "edit"}
        onClose={closeModal}
        mode={activeModal as any}
        formData={formData}
        onChange={handleInputChange}
        onSearchApi={handleSearchApi}
        onSubmit={handleSaveCustomer}
        isSearching={isSearchingApi}
        apiSuccess={apiSuccess}
      />

      <CustomerDeleteModal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
      />
    </div>
  );
};
