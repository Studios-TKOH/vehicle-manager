import React, { useState, useEffect, useRef } from "react";
import { X, Save, Search as SearchIcon } from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";
import type { VehicleFormData } from "@/types/vehicles";

interface VehicleFormModalProps {
  vehicle: any | null;
  customers: any[];
  isOpen: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  onSave: (data: VehicleFormData) => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  vehicle,
  customers,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!vehicle;

  // 1. ESTADOS DEL FORMULARIO Y AUTOCOMPLETADO
  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    customerId: "",
    conductorHabitualId: "",
    notes: "",
  });

  const [searchOwner, setSearchOwner] = useState("");
  const [showOwnerMenu, setShowOwnerMenu] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);

  const [searchDriver, setSearchDriver] = useState("");
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  // 2. REFERENCIAS
  const ownerMenuRef = useRef<HTMLDivElement>(null);
  const driverMenuRef = useRef<HTMLDivElement>(null);

  // 3. EFECTOS
  // Rellenar/Limpiar datos al abrir/cerrar el modal
  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        licensePlate: vehicle.licensePlate || "",
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        year: vehicle.year || new Date().getFullYear(),
        mileage: vehicle.mileage || vehicle.kmActual || "",
        customerId: vehicle.customerId || "",
        conductorHabitualId: vehicle.conductorHabitualId || "",
        notes: vehicle.notas === "Sin Observaciones" ? "" : vehicle.notas || "",
      });

      if (vehicle.customerId) {
        const owner = customers.find((c) => c.id === vehicle.customerId);
        if (owner) {
          setSelectedOwner(owner);
          setSearchOwner("");
        }
      }
      if (vehicle.conductorHabitualId) {
        const driver = customers.find(
          (c) => c.id === vehicle.conductorHabitualId,
        );
        if (driver) {
          setSelectedDriver(driver);
          setSearchDriver("");
        }
      }
    } else if (!isOpen) {
      setFormData({
        licensePlate: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: "",
        customerId: "",
        conductorHabitualId: "",
        notes: "",
      });
      setSelectedOwner(null);
      setSelectedDriver(null);
      setSearchOwner("");
      setSearchDriver("");
    }
  }, [vehicle, customers, isOpen]);

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

  // 4. HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.licensePlate) {
      alert("Por favor, selecciona un propietario y escribe la placa.");
      return;
    }

    const dataToSave: any = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
      mileage: formData.mileage ? Number(formData.mileage) : null,
    };

    if (!dataToSave.conductorHabitualId) {
      delete dataToSave.conductorHabitualId;
    }

    onSave(dataToSave);
  };

  // 5. LÓGICA DE AUTOCOMPLETADO
  const filterCustomers = (term: string) => {
    if (!term) return customers;
    const lowerTerm = term.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        (c.identityDocNumber && c.identityDocNumber.includes(lowerTerm)),
    );
  };

  const filteredOwners = filterCustomers(searchOwner);
  const filteredDrivers = filterCustomers(searchDriver);

  const handleSelectOwner = (customer: any) => {
    setSelectedOwner(customer);
    setFormData((prev) => ({ ...prev, customerId: customer.id }));
    setSearchOwner("");
    setShowOwnerMenu(false);
  };

  const handleClearOwner = () => {
    setSelectedOwner(null);
    setFormData((prev) => ({ ...prev, customerId: "" }));
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

  // 6. RENDER TEMPRANO (Siempre va después de los hooks)
  if (!isOpen) return null;

  // 7. RENDER JSX
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditing
              ? `Editar Vehículo: ${vehicle?.licensePlate}`
              : "Registrar Nuevo Vehículo"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formWrapper}>
          <div className={styles.modalBody}>
            <div className={styles.formSectionBlue}>
              <h3 className={styles.formSectionTitleBlue}>
                Asignación de Cliente
              </h3>
              <div className={styles.formGrid}>
                {/* PROPIETARIO */}
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
                                  {c.name}
                                </span>
                                <span className={styles.autocompleteItemDoc}>
                                  {c.identityDocType === "6" ? "RUC" : "DNI"}:{" "}
                                  {c.identityDocNumber}
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
                          title={selectedOwner.name}
                        >
                          {selectedOwner.name}
                        </span>
                        <span className={styles.selectedCustomerSubtext}>
                          {selectedOwner.identityDocType === "6"
                            ? "RUC"
                            : "DNI"}
                          : {selectedOwner.identityDocNumber}
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
                  <input
                    type="hidden"
                    name="customerId"
                    value={formData.customerId}
                    required
                  />
                </div>

                {/* CONDUCTOR */}
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
                                {selectedOwner.name}
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
                                  {c.name}
                                </span>
                                <span className={styles.autocompleteItemDoc}>
                                  {c.identityDocType === "6" ? "RUC" : "DNI"}:{" "}
                                  {c.identityDocNumber}
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
                          title={selectedDriver.name}
                        >
                          {selectedDriver.name}
                        </span>
                        <span className={styles.selectedCustomerSubtext}>
                          {selectedDriver.identityDocType === "6"
                            ? "RUC"
                            : "DNI"}
                          : {selectedDriver.identityDocNumber}
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

            <h3 className={styles.formSectionTitle}>Datos del Vehículo</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Placa <span className={styles.asterisk}>*</span>
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  required
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className={styles.inputUpper}
                  placeholder="Ej: ABC-123"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: TOYOTA"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Modelo</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: HILUX"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Año</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: 2024"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Kilometraje (Tablero) </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Ej: 45000"
                />
              </div>

              <div className={styles.formGroupWide}>
                <label className={styles.label}>Notas / Preferencias</label>
                <textarea
                  name="notes"
                  value={formData.notes}
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
