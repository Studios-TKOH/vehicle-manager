import React from "react";
import { CheckCircle2, Printer, FileDown, Plus } from "lucide-react";
import styles from "@styles/modules/sales.module.css";

export interface SaleSuccessData {
  docType: "01" | "03" | "PR";
  series: string;
  correlativeNumber: number;
  customerName: string;
  totalAmount: number;
}

interface Props {
  isOpen: boolean;
  saleData: SaleSuccessData | null;
  onNewSale: () => void;
  onPrintTicket: () => void;
  onDownloadPdf: () => void;
}

export const SaleSuccessModal: React.FC<Props> = ({
  isOpen,
  saleData,
  onNewSale,
  onPrintTicket,
  onDownloadPdf,
}) => {
  if (!isOpen || !saleData) return null;

  const getDocName = (type: string) => {
    if (type === "01") return "FACTURA ELECTRÓNICA";
    if (type === "03") return "BOLETA DE VENTA";
    return "PROFORMA / COTIZACIÓN";
  };

  const formattedCorrelative = String(saleData.correlativeNumber).padStart(
    6,
    "0",
  );
  const docNumber = `${saleData.series}-${formattedCorrelative}`;

  return (
    <div className={styles.successModalOverlay}>
      <div
        className={styles.successModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER (Verde Éxito) */}
        <div className={styles.successHeader}>
          <div className={styles.successIconBox}>
            <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className={styles.successTitle}>¡Venta Registrada!</h2>
          <p className={styles.successSubtitle}>
            El documento se ha guardado correctamente.
          </p>
        </div>

        {/* BODY (Resumen del Ticket) */}
        <div className={styles.successBody}>
          <div className={styles.receiptPreview}>
            <div className="flex flex-col gap-1">
              <span className={styles.receiptLabel}>
                {getDocName(saleData.docType)}
              </span>
              <span className={styles.receiptDoc}>{docNumber}</span>
            </div>

            <div className={styles.receiptCustomer}>
              {saleData.customerName}
            </div>

            <div className={styles.receiptTotalBox}>
              <span className={styles.receiptLabel}>Total a Pagar</span>
              <div className={styles.receiptTotal}>
                S/ {saleData.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (Acciones) */}
        <div className={styles.successActions}>
          <div className="flex gap-3">
            <button className={styles.btnActionOutline} onClick={onPrintTicket}>
              <Printer size={18} /> Ticket
            </button>
            <button className={styles.btnActionOutline} onClick={onDownloadPdf}>
              <FileDown size={18} /> PDF A4
            </button>
          </div>

          <button className={styles.btnActionSolid} onClick={onNewSale}>
            <Plus size={20} /> Nueva Venta
          </button>
        </div>
      </div>
    </div>
  );
};
