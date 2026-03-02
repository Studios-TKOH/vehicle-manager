import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-3 h-[38px] outline-none transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";