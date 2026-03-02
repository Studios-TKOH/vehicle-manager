import type { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export const FormField = ({ label, children, className = "" }: FormFieldProps) => {
    return (
        <div className={className}>
            <label className="block mb-1.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            {children}
        </div>
    );
};