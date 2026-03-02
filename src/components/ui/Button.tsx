import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "xl";
    icon?: ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
    variant = "primary",
    size = "md",
    icon,
    isLoading = false,
    fullWidth = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
        secondary:
            "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500 border border-slate-200",
        success:
            "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md hover:-translate-y-0.5",
        danger:
            "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm",
        ghost:
            "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
        outline:
            "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
        xl: "px-6 py-4 text-lg h-16",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""
                } ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 w-5 h-5 animate-spin" />}

            {!isLoading && icon && <span className="mr-2">{icon}</span>}

            {children}
        </button>
    );
};