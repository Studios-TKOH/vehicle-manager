import React, { useState } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { FormField } from "@components/ui/FormField";
import styles from "@styles/modules/reports.module.css";

interface VehiculoHistorialTabProps {
  sales: any[];
}

export const VehiculoHistorialTab: React.FC<VehiculoHistorialTabProps> = ({
  sales,
}) => {
  const [searchPlaca, setSearchPlaca] = useState("");

  const filteredHistory = sales.filter(
    (sale) =>
      searchPlaca === "" ||
      (sale.vehiclePlate &&
        sale.vehiclePlate.toLowerCase().includes(searchPlaca.toLowerCase())),
  );

  return (
    <div className={styles.tabContainer}>
      <section className={styles.cardFilters}>
        <div className={styles.dateGroup}>
          <FormField label="Buscar Vehículo (Placa)">
            <div className={styles.dateBox}>
              <Input
                type="text"
                placeholder="Ej: ABC-123"
                value={searchPlaca}
                onChange={(e) => setSearchPlaca(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </FormField>
        </div>

        <div className={styles.noFiltersMessage}>
          Filtro de Mantenimientos Activo
        </div>
      </section>

      <div className={styles.cardActions}>
        <Button variant="outline" className={styles.btnPreview}>
          Ver Hoja de Servicio
        </Button>
        <Button variant="primary" className={styles.btnDownload}>
          Descargar Historial
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.excelTable}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.thBase}>Fecha de Emisión</th>
              <th className={styles.thBase}>Placa Vehículo</th>
              <th className={styles.thBase}>Comprobante Base</th>
              <th className={styles.thBase}>Monto Invertido</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((v) => (
                <tr key={v.id} className={styles.tableRow}>
                  <td className={styles.tdBase}>
                    {new Date(v.issueDate).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className={styles.tdBase}>
                    <span className={styles.plateBadge}>
                      {v.vehiclePlate || "SIN PLACA"}
                    </span>
                  </td>
                  <td className={styles.tdBase}>
                    <span className={styles.docBadge}>
                      {v.series}-{String(v.correlativeNumber).padStart(6, "0")}
                    </span>
                  </td>
                  <td className={styles.tdTotal}>
                    S/ {v.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.emptyState}>
                  No hay registros de mantenimiento para la placa consultada o
                  el historial está vacío.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
