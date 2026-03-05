import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search as SearchIcon,
  ClipboardList,
  Trash2,
  Save,
  ShoppingBag,
} from "lucide-react";
import styles from "@styles/modules/vehicles.module.css";
import type { ProductEntity } from "@data/LocalDB";

interface UsualProductItem {
  productId: string;
  productName: string;
  productCode: string;
  notes: string;
}

interface VehicleUsualProductsModalProps {
  vehicle: any | null;
  productsList: ProductEntity[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    vehicleId: string,
    items: { productId: string; notes: string }[],
  ) => void;
}

export const VehicleUsualProductsModal: React.FC<
  VehicleUsualProductsModalProps
> = ({ vehicle, productsList, isOpen, onClose, onSave }) => {
  const [selectedItems, setSelectedItems] = useState<UsualProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vehicle && isOpen) {
      if (
        vehicle.productosHabituales &&
        vehicle.productosHabituales.length > 0
      ) {
        setSelectedItems([...vehicle.productosHabituales]);
      } else {
        setSelectedItems([]);
      }
      setSearchQuery("");
      setShowMenu(false);
    }
  }, [vehicle, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !vehicle) return null;

  const filteredProducts = productsList.filter((p) => {
    if (!searchQuery) return false;
    const term = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  const handleSelectProduct = (product: ProductEntity) => {
    if (!selectedItems.some((item) => item.productId === product.id)) {
      setSelectedItems((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          notes: "",
        },
      ]);
    }
    setSearchQuery("");
    setShowMenu(false);
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const handleNotesChange = (productId: string, value: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, notes: value } : item,
      ),
    );
  };

  const handleSubmit = () => {
    const dataToSave = selectedItems.map((item) => ({
      productId: item.productId,
      notes: item.notes,
    }));
    onSave(vehicle.id, dataToSave);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <div className={styles.modalTitleIconBox}>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <div className={styles.modalTitleTextContainer}>
              <span className={styles.modalTitleText}>Ficha Técnica</span>
              <span className={styles.modalTitleSubtext}>
                Productos habituales para {vehicle.licensePlate}
              </span>
            </div>
          </h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formSectionBlue}>
            <h3 className={styles.formSectionTitleBlue}>
              Añadir Producto a la Plantilla
            </h3>

            <div className={styles.autocompleteWrapper} ref={menuRef}>
              <div className={styles.autocompleteInputContainer}>
                <SearchIcon className={styles.autocompleteSearchIcon} />
                <input
                  type="text"
                  className={styles.autocompleteInput}
                  placeholder="Buscar producto por nombre o código..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowMenu(true);
                  }}
                  onFocus={() => setShowMenu(true)}
                />
              </div>

              {showMenu && searchQuery.length > 0 && (
                <div className={styles.autocompleteMenu}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className={styles.autocompleteItem}
                        onClick={() => handleSelectProduct(p)}
                      >
                        <span className={styles.autocompleteItemName}>
                          {p.name}
                        </span>
                        <span className={styles.autocompleteItemDoc}>
                          Cód: {p.code} | Categ: {p.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.autocompleteEmpty}>
                      No se encontraron productos.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <h3 className={styles.formSectionTitle}>
            Lista de Productos Habituales
          </h3>

          {selectedItems.length > 0 ? (
            <div className={styles.usualProductList}>
              {selectedItems.map((item) => (
                <div
                  key={item.productId}
                  className={styles.usualProductItemBox}
                >
                  <div className={styles.usualProductDetails}>
                    <span className={styles.usualProductName}>
                      {item.productName}
                    </span>
                    <span className={styles.usualProductSku}>
                      SKU: {item.productCode}
                    </span>
                  </div>
                  <div className={styles.usualProductInputWrapper}>
                    <input
                      type="text"
                      placeholder="Nota (Ej: 2.5 Galones)"
                      className={styles.usualProductNotesInput}
                      value={item.notes}
                      onChange={(e) =>
                        handleNotesChange(item.productId, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className={styles.usualProductDeleteBtn}
                      title="Quitar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.usualProductEmptyState}>
              <ShoppingBag className={styles.usualProductEmptyIcon} />
              <p className={styles.usualProductEmptyText}>
                Aún no hay productos en la ficha técnica.
              </p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSubmit}
          >
            <Save className="w-5 h-5" />
            Guardar Ficha Técnica
          </button>
        </div>
      </div>
    </div>
  );
};
