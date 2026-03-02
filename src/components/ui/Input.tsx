import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className = "", ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-3 h-[38px] outline-none transition-all disabled:opacity-50 disabled:bg-slate-100 ${props.readOnly ? "bg-slate-50" : "bg-white"
                    } ${className}`}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";