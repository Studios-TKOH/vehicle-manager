import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "@styles/modules/sales.module.css";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`${styles.inputGenericBase} ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";
