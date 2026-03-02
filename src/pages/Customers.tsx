import { useCustomers } from "@/hooks/useCustomers";
import styles from "@/styles/modules/Customers.module.css";
import { Search, Plus, Users, Eye, Edit2, Trash2, Truck } from "lucide-react";
import { CustomerDetailsModal } from "@/components/customers/CustomerDetailsModal";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { CustomerDeleteModal } from "@/components/customers/CustomerDeleteModal";
import { useState, useEffect } from "react";

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
    isSearchingApi
  } = useCustomers();
  
  const [formData, setFormData] = useState({
    tipoDocumentoIdentidad: "RUC", numeroDocumento: "", nombreRazonSocial: "", direccion: "", telefono: "", email: ""
  });
  const [apiSuccess, setApiSuccess] = useState(false);

  useEffect(() => {
    if (activeModal === "edit" && selectedCustomer) setFormData(selectedCustomer);
    else if (activeModal === "add") {
      setFormData({ tipoDocumentoIdentidad: "RUC", numeroDocumento: "", nombreRazonSocial: "", direccion: "", telefono: "", email: "" });
      setApiSuccess(false);
    }
  }, [activeModal, selectedCustomer]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiSuccess(false);
  };

  const handleSearchApi = async () => {
    const data = await fetchDecolectaData(formData.tipoDocumentoIdentidad, formData.numeroDocumento);
    if (data) {
      setFormData(prev => ({ ...prev, nombreRazonSocial: data.nombreRazonSocial, direccion: data.direccion }));
      setApiSuccess(true);
    }
  };

  const handleConfirmDelete = () => {
    console.log("Eliminando cliente:", selectedCustomer?.id);
    closeModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><Users className="text-blue-600" /> Directorio de Clientes</h1>
        <button className={styles.addButton} onClick={() => openModal("add")}><Plus size={20} /> REGISTRAR CLIENTE</button>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Buscar por documento o nombre..." value={searchTerm} onChange={handleSearch} />
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
              <th>DOCUMENTO</th>
              <th>CLIENTE / RAZÓN SOCIAL</th>
              <th>CONTACTO</th>
              <th className="text-center">VEHÍCULOS</th>
              <th className="text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="font-mono font-bold text-slate-600 italic">{customer.numeroDocumento}</td>
                  <td className="font-black text-slate-800 text-sm uppercase tracking-tight">{customer.nombreRazonSocial}</td>
                  <td>
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-slate-700">{customer.telefono || "---"}</span>
                      <span className="text-[10px] text-slate-400">{customer.email || "---"}</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <button onClick={() => openModal("details", customer)} className="bg-blue-50 hover:bg-blue-600 px-3 py-1.5 border border-blue-100 rounded-xl font-black text-blue-600 hover:text-white text-xs transition-all">
                      <Truck size={14} className="inline stroke-[3] mr-1" />{customer.totalVehiculosRelacionados}
                    </button>
                  </td>
                  <td className="text-center">
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


      <CustomerDetailsModal
        isOpen={activeModal === 'details'}
        onClose={closeModal}
        customer={selectedCustomer}
      />

      <CustomerFormModal
        isOpen={activeModal === 'add' || activeModal === 'edit'}
        onClose={closeModal}
        mode={activeModal as any}
        formData={formData}
        onChange={handleInputChange}
        onSearchApi={handleSearchApi}
        isSearching={isSearchingApi}
        apiSuccess={apiSuccess}
      />

      <CustomerDeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
      />
    </div>
  );
};