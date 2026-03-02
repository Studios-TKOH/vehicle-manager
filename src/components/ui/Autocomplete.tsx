import type { ReactNode } from "react";
import { Search, X } from "lucide-react";

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
    icon = <Search className="w-4 h-4" />,
    inputHeightClass = "h-[38px]",
    dropdownPosition = "bottom",
}: AutocompleteProps<T>) {
    const displayValue = selectedItem ? getDisplayValue(selectedItem) : searchValue;

    const dropdownClasses = dropdownPosition === "top"
        ? "bottom-[calc(100%+8px)] mb-1"
        : "top-full mt-1";

    return (
        <div className="relative w-full">
            <div className={`relative flex items-center border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden ${inputHeightClass}`}>
                <div className="pr-2 pl-3 text-slate-400">
                    {icon}
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="bg-transparent px-2 border-none outline-none w-full font-semibold text-slate-700 text-sm"
                    value={displayValue}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        if (selectedItem) onClear();
                    }}
                />
                {selectedItem && (
                    <button
                        onClick={onClear}
                        className="pr-3 text-slate-400 hover:text-red-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {searchValue && !selectedItem && options.length > 0 && (
                <div className={`absolute left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl z-50 max-h-60 overflow-y-auto ${dropdownClasses}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="hover:bg-slate-50 p-3 border-slate-100 last:border-0 border-b cursor-pointer"
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