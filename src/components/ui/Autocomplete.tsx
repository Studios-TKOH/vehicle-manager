import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import styles from "@styles/modules/sales.module.css";

interface AutocompleteProps<T> {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedItem: T | null;
  onClear: () => void;
  onSelect: (item: T) => void;
  options: T[];
  renderOption: (item: T) => ReactNode;
  getDisplayValue: (item: T) => string;
  icon?: ReactNode;
  inputHeightClass?: string;
  dropdownPosition?: "top" | "bottom";
}

export function Autocomplete<T>({
  placeholder = "Buscar...",
  searchValue,
  onSearchChange,
  selectedItem,
  onClear,
  onSelect,
  options,
  renderOption,
  getDisplayValue,
  icon = <Search className={styles.autocompleteClearIcon} />,
  inputHeightClass = "",
  dropdownPosition = "bottom",
}: AutocompleteProps<T>) {
  const displayValue = selectedItem
    ? getDisplayValue(selectedItem)
    : searchValue;

  const dropdownClasses =
    dropdownPosition === "top"
      ? styles.autocompleteDropdownPositionTop
      : styles.autocompleteDropdownPositionBottom;

  return (
    <div className={styles.autocompleteWrapperBase}>
      <div
        className={`${styles.autocompleteInputContainerBase} ${inputHeightClass}`}
      >
        <div className={styles.autocompleteIconBox}>{icon}</div>
        <input
          type="text"
          placeholder={placeholder}
          className={styles.autocompleteNativeInput}
          value={displayValue}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (selectedItem) onClear();
          }}
        />
        {selectedItem && (
          <button onClick={onClear} className={styles.autocompleteClearButton}>
            <X className={styles.autocompleteClearIcon} />
          </button>
        )}
      </div>

      {searchValue && !selectedItem && options.length > 0 && (
        <div
          className={`${styles.autocompleteDropdownContainer} ${dropdownClasses}`}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.autocompleteDropdownItem}
              onClick={() => {
                onSelect(option);
                onSearchChange("");
              }}
            >
              {renderOption(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
