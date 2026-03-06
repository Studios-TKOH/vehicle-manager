import type { ReactNode } from "react";
import styles from "@styles/modules/sales.module.css";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  children,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className={styles.formFieldGenericLabel}>{label}</label>
      {children}
    </div>
  );
};
