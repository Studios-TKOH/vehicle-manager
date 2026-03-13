import React from "react";
import {
  CheckCircle2,
  Printer,
  FileDown,
  Plus,
  FileText,
  AlertCircle,
  Clock,
  XCircle,
  CalendarClock,
} from "lucide-react";
import styles from "@styles/modules/sales.module.css";

export interface SaleSuccessData {
  docType: "01" | "03" | "PR" | string;
  series: string;
  correlativeNumber: number;
  customerName: string;
  customerDocument?: string;
  totalAmount: number;
  issueDate: string;
  dueDate?: string | null;
  sunatStatus: string;
}

interface Props {
  isOpen: boolean;
  mode?: "success" | "history";
  saleData: SaleSuccessData | null;
  onNewSale?: () => void;
  onPrintTicket: () => void;
  onDownloadPdf: () => void;
  onClose?: () => void;
}

export const SaleSuccessModal: React.FC<Props> = ({
  isOpen,
  mode = "success",
  saleData,
  onNewSale,
  onPrintTicket,
  onDownloadPdf,
  onClose,
}) => {
  if (!isOpen || !saleData) return null;

  const isHistory = mode === "history";

  const getDocName = (type: string) => {
    if (type === "01") return "FACTURA ELECTRÓNICA";
    if (type === "03") return "BOLETA DE VENTA";
    if (type === "07") return "NOTA DE CRÉDITO";
    if (type === "08") return "NOTA DE DÉBITO";
    return "PROFORMA / COTIZACIÓN";
  };

  const renderSunatStatus = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span
            className={`${styles.badgeStatusModal} ${styles.statusAcceptedModal}`}
          >
            <CheckCircle2 size={12} /> Aceptado
          </span>
        );
      case "SENT":
        return (
          <span
            className={`${styles.badgeStatusModal} ${styles.statusSentModal}`}
          >
            <Clock size={12} /> Enviado
          </span>
        );
      case "NOT_SENT":
        return (
          <span
            className={`${styles.badgeStatusModal} ${styles.statusPendingModal}`}
          >
            <AlertCircle size={12} /> Pendiente
          </span>
        );
      case "REJECTED":
      case "VOIDED":
        return (
          <span
            className={`${styles.badgeStatusModal} ${styles.statusRejectedModal}`}
          >
            <XCircle size={12} />{" "}
            {status === "REJECTED" ? "Rechazado" : "Anulado"}
          </span>
        );
      default:
        return null;
    }
  };

  const formattedCorrelative = String(saleData.correlativeNumber).padStart(
    6,
    "0",
  );
  const docNumber = `${saleData.series}-${formattedCorrelative}`;

  // Formateamos la hora para que se vea amigable (Ej: 15 de marzo de 2026, 04:30 PM)
  const formattedDateTime = new Date(saleData.issueDate).toLocaleString(
    "es-PE",
    {
      dateStyle: "long",
      timeStyle: "short",
      hour12: true,
    },
  );

  return (
    <div className={styles.successModalOverlay} onClick={onClose}>
      <div
        className={styles.successModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER DINÁMICO */}
        <div
          className={
            isHistory ? styles.historyHeaderModal : styles.successHeader
          }
        >
          <div className={styles.successIconBox}>
            {isHistory ? (
              <FileText size={48} className={styles.formSuccessWhiteText} strokeWidth={2} />
            ) : (
              <CheckCircle2
                size={48}
                className={styles.formSuccessWhiteText}
                strokeWidth={2.5}
              />
            )}
          </div>
          <h2 className={styles.successTitle}>
            {isHistory ? "Detalle de Documento" : "¡Venta Registrada!"}
          </h2>
          <p className={styles.successSubtitle}>
            {isHistory
              ? "Visualización y reimpresión de comprobante."
              : "El documento se ha guardado correctamente."}
          </p>
        </div>

        {/* BODY (Resumen del Ticket) */}
        <div className={styles.successBody}>
          <div className={styles.receiptPreview}>
            <div className={styles.receiptTopRow}>
              <div>
                <span className={styles.receiptLabel}>
                  {getDocName(saleData.docType)}
                </span>
                <span className={styles.receiptDoc}>{docNumber}</span>
              </div>
              {/* Badge SUNAT */}
              <div>{renderSunatStatus(saleData.sunatStatus)}</div>
            </div>

            <div className={styles.receiptCustomer}>
              {saleData.customerName}
              <span className={styles.receiptCustomerDoc}>
                Doc: {saleData.customerDocument || "Público General"}
              </span>
            </div>

            <span className={styles.receiptDate}>
              <CalendarClock size={14} /> Emitido el {formattedDateTime}
            </span>

            <div className={styles.receiptTotalBox}>
              <span className={styles.receiptLabel}>Total de Operación</span>
              <div className={styles.receiptTotal}>
                S/ {saleData.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (Acciones) */}
        <div className={styles.successActions}>
          <div className={styles.formSuccessWideText}>
            <button className={styles.btnActionOutline} onClick={onPrintTicket}>
              <Printer size={18} /> TICKET 80MM
            </button>
            <button className={styles.btnActionOutline} onClick={onDownloadPdf}>
              <FileDown size={18} /> PDF A4
            </button>
          </div>

          {isHistory ? (
            <button
              className={styles.btnSecondary}
              onClick={onClose}
              style={{ height: "48px" }}
            >
              Cerrar Ventana
            </button>
          ) : (
            <button className={styles.btnActionSolid} onClick={onNewSale}>
              <Plus size={20} /> NUEVA VENTA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
