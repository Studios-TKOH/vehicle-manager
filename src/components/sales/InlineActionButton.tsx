import type { ReactNode } from "react";

interface InlineActionButtonProps {
    label: string;
    value: string;
    icon?: ReactNode;
    isEditing: boolean;
    onToggle: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
}

export const InlineActionButton = ({
    label,
    value,
    icon,
    isEditing,
    onToggle,
    onBlur,
    onChange,
}: InlineActionButtonProps) => {
    const isActive = value.trim().length > 0;
    const baseColor = isActive
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-blue-600 hover:bg-blue-700";

    return (
        <button
            onClick={onToggle}
            className={`w-full h-11 px-2 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm ${baseColor}`}
        >
            {isEditing ? (
                <input
                    autoFocus
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    onKeyDown={(e) => e.key === "Enter" && onBlur()}
                    className="bg-transparent border-white/50 border-b outline-none w-full text-white text-center placeholder-white/70"
                    placeholder={`DIGITE ${label}`}
                />
            ) : (
                <>
                    {icon && !isActive && icon}
                    <span className="truncate whitespace-nowrap">{label}</span>
                    {isActive && <span className="ml-1">✓</span>}
                </>
            )}
        </button>
    );
};