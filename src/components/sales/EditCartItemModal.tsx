import React, { useState, useEffect } from "react";
import { X, Save, Edit3 } from "lucide-react";
import styles from "@styles/modules/sales.module.css";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { FormField } from "@components/ui/FormField";
import type { CartItem } from "@hooks/useSales";

interface Props {
  isOpen: boolean;
  item: CartItem | null;
  onClose: () => void;
  onSave: (tempId: string, newName: string, newPrice: number) => void;
}

export const EditCartItemModal: React.FC<Props> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setPrice(item.price.toString());
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert("Por favor ingrese un precio válido.");
      return;
    }
    onSave(item.tempId, name, parsedPrice);
    onClose();
  };

  return (
    <div className={styles.editItemModalOverlay} onClick={onClose}>
      <div
        className={styles.editItemModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.editItemHeader}>
          <h3 className={styles.editItemTitle}>
            <Edit3 className={styles.apiSearchIcon} size={20} />
            Editar Línea
          </h3>
          <button onClick={onClose} className={styles.btnDisabled}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.editItemBody}>
          <FormField label="Descripción en Factura">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto o servicio..."
            />
          </FormField>
          <FormField label="Precio Unitario (Inluye IGV)">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormField>
        </div>

        <div className={styles.editItemFooter}>
          <button
            type="button"
            className={styles.btnModalCancel}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnModalConfirm}
            onClick={handleSave}
          >
            <Save size={20} /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
