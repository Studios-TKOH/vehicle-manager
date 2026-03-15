import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Eye,
} from "lucide-react";
import { useSalesHistory } from "@hooks/useSalesHistory";
import styles from "@styles/modules/sales-history.module.css";
import { SaleSuccessModal } from "@components/sales/SaleSuccessModal";

export const SalesHistory = () => {
  const {
    selectedDateString,
    handleDateChange,
    formattedDateText,
    handlePrevDay,
    handleNextDay,
    searchQuery,
    setSearchQuery,
    sales,
    currentPage,
    totalPages,
    totalItems,
    handleNextPage,
    handlePrevPage,
    isLoading,
    selectedSale,
    handleOpenDetails,
    handleCloseDetails,
  } = useSalesHistory();

  const getDocTypeName = (type: string) => {
    if (type === "01") return "Factura";
    if (type === "03") return "Boleta";
    if (type === "07") return "N. Crédito";
    if (type === "08") return "N. Débito";
    return "Proforma";
  };

  const renderSunatStatus = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className={`${styles.badgeStatus} ${styles.statusAccepted}`}>
            <CheckCircle2 size={14} /> Aceptado
          </span>
        );
      case "SENT":
        return (
          <span className={`${styles.badgeStatus} ${styles.statusSent}`}>
            <Clock size={14} /> Enviado
          </span>
        );
      case "NOT_SENT":
        return (
          <span className={`${styles.badgeStatus} ${styles.statusPending}`}>
            <AlertCircle size={14} /> Pendiente
          </span>
        );
      case "REJECTED":
      case "VOIDED":
        return (
          <span className={`${styles.badgeStatus} ${styles.statusRejected}`}>
            <XCircle size={14} />{" "}
            {status === "REJECTED" ? "Rechazado" : "Anulado"}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.dateNavigator}>
          <button className={styles.arrowBtn} onClick={handlePrevDay}>
            <ChevronLeft size={20} />
          </button>

          <div
            className={styles.dateTextWrapper}
            title="Haz clic para elegir una fecha"
          >
            <Calendar className={styles.dateIcon} />
            <span className={styles.dateText}>{formattedDateText}</span>
            <input
              type="date"
              className={styles.hiddenDateInput}
              value={selectedDateString}
              onChange={handleDateChange}
            />
          </div>

          <button className={styles.arrowBtn} onClick={handleNextDay}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por Cliente, Placa o N° Serie..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.emptyState}>Cargando historial...</div>
        ) : sales.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyStateIcon} />
            <p>
              No se encontraron ventas para este día o criterio de búsqueda.
            </p>
          </div>
        ) : (
          <table className={styles.historyTable}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.thBase}>Hora</th>
                <th className={styles.thBase}>Comprobante</th>
                <th className={styles.thBase}>Cliente</th>
                <th className={styles.thBase}>Vehículo</th>
                <th className={styles.thBase}>Total</th>
                <th className={styles.thBase}>Estado SUNAT</th>
                <th className={styles.thBase}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                const issueTime = new Date(sale.issueDate).toLocaleTimeString(
                  "es-PE",
                  { hour: "2-digit", minute: "2-digit" },
                );

                return (
                  <tr key={sale.id} className={styles.tableRow}>
                    <td className={styles.tdBase}>{issueTime}</td>
                    <td className={styles.tdBase}>
                      <span className={styles.documentText}>
                        {sale.series}-
                        {String(sale.correlativeNumber).padStart(6, "0")}
                      </span>
                      <br />
                      <span className={styles.docTypeBadge}>
                        {getDocTypeName(sale.docType)}
                      </span>
                    </td>
                    <td className={styles.tdBase}>
                      <span className={styles.clientText}>
                        {sale.customer?.name || "Público en General"}
                      </span>
                    </td>
                    <td className={styles.tdBase}>
                      {sale.vehicle ? (
                        <span className={styles.plateBadge}>
                          <Car size={12} /> {sale.vehicle.licensePlate}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          Sin Vehículo
                        </span>
                      )}
                    </td>
                    <td className={styles.tdBase}>
                      <span className={styles.totalText}>
                        S/ {sale.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className={styles.tdBase}>
                      {renderSunatStatus(sale.sunatStatus)}
                    </td>
                    <td className={styles.tdBase}>
                      <button
                        onClick={() => handleOpenDetails(sale)}
                        className={styles.btnAction}
                        title="Ver Detalles y Reimprimir"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.paginationArea}>
        <span className={styles.paginationInfo}>
          Mostrando página {totalItems === 0 ? 0 : currentPage} de {totalPages}{" "}
          ({totalItems} ventas)
        </span>
        <div className={styles.paginationControls}>
          <button
            className={styles.pageBtn}
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || totalItems === 0}
          >
            Anterior
          </button>
          <button
            className={styles.pageBtn}
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || totalItems === 0}
          >
            Siguiente
          </button>
        </div>
      </div>

      <SaleSuccessModal
        isOpen={!!selectedSale}
        mode="history"
        saleData={selectedSale}
        onClose={handleCloseDetails}
        onPrintTicket={() => alert("Simulando impresión de ticket...")}
        onDownloadPdf={() => alert("Simulando descarga de PDF...")}
      />
    </div>
  );
};
