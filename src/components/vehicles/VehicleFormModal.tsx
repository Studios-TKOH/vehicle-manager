import React, { useState, useEffect, useRef } from "react";
import { X, Save, Search as SearchIcon } from "lucide-react";
import styles from "../../styles/modules/vehicles.module.css";

interface VehicleFormModalProps {
  vehicle: any | null;
  customers: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  vehicle,
  customers,
  onClose,
  onSave,
}) => {
  const isEditing = !!vehicle;

  // Estados del formulario
  const [formData, setFormData] = useState({
    placa: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    color: "",
    kilometrajeActual: "",
    propietarioId: "",
    conductorHabitualId: "",
    notas: "",
  });

  // Estados para el autocompletado del Propietario
  const [searchOwner, setSearchOwner] = useState("");
  const [showOwnerMenu, setShowOwnerMenu] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);

  // Estados para el autocompletado del Conductor
  const [searchDriver, setSearchDriver] = useState("");
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  // Referencias para cerrar menús al hacer clic fuera
  const ownerMenuRef = useRef<HTMLDivElement>(null);
  const driverMenuRef = useRef<HTMLDivElement>(null);

  // Si estamos editando, rellenar los datos
  useEffect(() => {
    if (vehicle) {
      setFormData({
        placa: vehicle.placa || "",
        marca: vehicle.marca || "",
        modelo: vehicle.modelo || "",
        anio: vehicle.anio || new Date().getFullYear(),
        color: vehicle.color || "",
        kilometrajeActual: vehicle.kilometrajeActual || vehicle.kmActual || "",
        propietarioId: vehicle.propietarioId || "",
        conductorHabitualId: vehicle.conductorHabitualId || "",
        notas: vehicle.notas === "Sin Observaciones" ? "" : vehicle.notas || "",
      });

      // Rellenar clientes seleccionados
      if (vehicle.propietarioId) {
        const owner = customers.find((c) => c.id === vehicle.propietarioId);
        if (owner) setSelectedOwner(owner);
      }
      if (vehicle.conductorHabitualId) {
        const driver = customers.find(
          (c) => c.id === vehicle.conductorHabitualId,
        );
        if (driver) setSelectedDriver(driver);
      }
    }
  }, [vehicle, customers]);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ownerMenuRef.current &&
        !ownerMenuRef.current.contains(event.target as Node)
      ) {
        setShowOwnerMenu(false);
      }
      if (
        driverMenuRef.current &&
        !driverMenuRef.current.contains(event.target as Node)
      ) {
        setShowDriverMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Lógica de filtrado
  const filterCustomers = (searchTerm: string) => {
    if (!searchTerm) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.nombreRazonSocial.toLowerCase().includes(term) ||
        (c.numeroDocumento && c.numeroDocumento.includes(term)),
    );
  };

  const filteredOwners = filterCustomers(searchOwner);
  const filteredDrivers = filterCustomers(searchDriver);

  // Manejadores de selección
  const handleSelectOwner = (customer: any) => {
    setSelectedOwner(customer);
    setFormData((prev) => ({ ...prev, propietarioId: customer.id }));
    setSearchOwner("");
    setShowOwnerMenu(false);
  };

  const handleClearOwner = () => {
    setSelectedOwner(null);
    setFormData((prev) => ({ ...prev, propietarioId: "" }));
  };

  const handleSelectDriver = (customer: any) => {
    setSelectedDriver(customer);
    setFormData((prev) => ({ ...prev, conductorHabitualId: customer.id }));
    setSearchDriver("");
    setShowDriverMenu(false);
  };

  const handleClearDriver = () => {
    setSelectedDriver(null);
    setFormData((prev) => ({ ...prev, conductorHabitualId: "" }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditing
              ? `Editar Vehículo: ${vehicle.placa}`
              : "Registrar Nuevo Vehículo"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <div className={styles.modalBody}>
            {/* Sección: Relaciones */}
            <div className={styles.formSectionBlue}>
              <h3 className={styles.formSectionTitleBlue}>
                Asignación de Cliente
              </h3>
              <div className={styles.formGrid}>
                {/* AUTOCOMPLETADO PROPIETARIO */}
                <div className={styles.formGroup} ref={ownerMenuRef}>
                  <label className={styles.label}>
                    Propietario / Empresa{" "}
                    <span className={styles.asterisk}>*</span>
                  </label>

                  {!selectedOwner ? (
                    <div className={styles.autocompleteWrapper}>
                      <div className={styles.autocompleteInputContainer}>
                        <SearchIcon className={styles.autocompleteSearchIcon} />
                        <input
                          type="text"
                          className={styles.autocompleteInput}
                          placeholder="Buscar por Nombre, RUC o DNI..."
                          value={searchOwner}
                          onChange={(e) => {
                            setSearchOwner(e.target.value);
                            setShowOwnerMenu(true);
                          }}
                          onFocus={() => setShowOwnerMenu(true)}
                        />
                      </div>

                      {showOwnerMenu && (
                        <div className={styles.autocompleteMenu}>
                          {filteredOwners.length > 0 ? (
                            filteredOwners.map((c) => (
                              <div
                                key={c.id}
                                className={styles.autocompleteItem}
                                onClick={() => handleSelectOwner(c)}
                              >
                                <span className={styles.autocompleteItemName}>
                                  {c.nombreRazonSocial}
                                </span>
                                <span className={styles.autocompleteItemDoc}>
                                  {c.tipoDocumentoIdentidad}:{" "}
                                  {c.numeroDocumento}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className={styles.autocompleteEmpty}>
                              No se encontraron clientes.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.selectedCustomerBadge}>
                      <div className={styles.selectedCustomerInfo}>
                        <span
                          className={styles.selectedCustomerText}
                          title={selectedOwner.nombreRazonSocial}
                        >
                          {selectedOwner.nombreRazonSocial}
                        </span>
                        <span className={styles.selectedCustomerSubtext}>
                          {selectedOwner.tipoDocumentoIdentidad}:{" "}
                          {selectedOwner.numeroDocumento}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.clearCustomerBtn}
                        onClick={handleClearOwner}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {/* Input oculto para validación HTML HTML5 */}
                  <input
                    type="hidden"
                    name="propietarioId"
                    value={formData.propietarioId}
                    required
                  />
                </div>

                {/* AUTOCOMPLETADO CONDUCTOR */}
                <div className={styles.formGroup} ref={driverMenuRef}>
                  <label className={styles.label}>Conductor Habitual</label>

                  {!selectedDriver ? (
                    <div className={styles.autocompleteWrapper}>
                      <div className={styles.autocompleteInputContainer}>
                        <SearchIcon className={styles.autocompleteSearchIcon} />
                        <input
                          type="text"
                          className={styles.autocompleteInput}
                          placeholder="Buscar por Nombre o DNI (Opcional)..."
                          value={searchDriver}
                          onChange={(e) => {
                            setSearchDriver(e.target.value);
                            setShowDriverMenu(true);
                          }}
                          onFocus={() => setShowDriverMenu(true)}
                        />
                      </div>

                      {showDriverMenu && (
                        <div className={styles.autocompleteMenu}>
                          {/* Opción rápida para copiar el dueño */}
                          {selectedOwner && (
                            <div
                              className={styles.autocompleteItemHighlight}
                              onClick={() => handleSelectDriver(selectedOwner)}
                            >
                              <span
                                className={styles.autocompleteItemNameHighlight}
                              >
                                Mismo que el propietario
                              </span>
                              <span className={styles.autocompleteItemDoc}>
                                {selectedOwner.nombreRazonSocial}
                              </span>
                            </div>
                          )}

                          {filteredDrivers.length > 0 ? (
                            filteredDrivers.map((c) => (
                              <div
                                key={c.id}
                                className={styles.autocompleteItem}
                                onClick={() => handleSelectDriver(c)}
                              >
                                <span className={styles.autocompleteItemName}>
                                  {c.nombreRazonSocial}
                                </span>
                                <span className={styles.autocompleteItemDoc}>
                                  {c.tipoDocumentoIdentidad}:{" "}
                                  {c.numeroDocumento}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className={styles.autocompleteEmpty}>
                              No se encontraron choferes.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.selectedCustomerBadge}>
                      <div className={styles.selectedCustomerInfo}>
                        <span
                          className={styles.selectedCustomerText}
                          title={selectedDriver.nombreRazonSocial}
                        >
                          {selectedDriver.nombreRazonSocial}
                        </span>
                        <span className={styles.selectedCustomerSubtext}>
                          {selectedDriver.tipoDocumentoIdentidad}:{" "}
                          {selectedDriver.numeroDocumento}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.clearCustomerBtn}
                        onClick={handleClearDriver}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Datos del Vehículo */}
            <h3 className={styles.formSectionTitle}>Datos del Vehículo</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Placa <span className={styles.asterisk}>*</span>
                </label>
                <input
                  type="text"
                  name="placa"
                  required
                  value={formData.placa}
                  onChange={handleChange}
                  className={styles.inputUpper}
                  placeholder="Ej: ABC-123"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: TOYOTA"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: HILUX"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Año</label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: 2024"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: Blanco"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Kilometraje (Tablero){" "}
                  <span className={styles.asterisk}>*</span>
                </label>
                <input
                  type="number"
                  name="kilometrajeActual"
                  required
                  value={formData.kilometrajeActual}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: 45000"
                />
              </div>

              <div className={styles.formGroupWide}>
                <label className={styles.label}>Notas / Preferencias</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Preferencias del cliente (Ej: Solo usa aceite sintético)..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary}>
              <Save className="w-5 h-5" />
              {isEditing ? "Guardar Cambios" : "Registrar Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
