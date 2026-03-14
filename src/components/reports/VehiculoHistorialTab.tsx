import React, { useState, useMemo } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { FormField } from '@components/ui/FormField';
import styles from '@styles/modules/reports.module.css';
import { exportToExcel } from '@utils/excel';
import { formatToDate } from '@utils/dateFormats';
import { DOC_TYPES, type DocTypeCode } from '@constants/docTypes';

interface VehiculoHistorialTabProps {
  sales: any[];
}

export const VehiculoHistorialTab: React.FC<VehiculoHistorialTabProps> = ({ sales }) => {
  const [plateFilter, setPlateFilter] = useState('');

  const filteredData = useMemo(() => {
    if (!plateFilter.trim()) return [];
    return sales.filter(s =>
      s.vehiclePlate?.toLowerCase().includes(plateFilter.toLowerCase())
    );
  }, [sales, plateFilter]);

  const handleExportExcel = async () => {
    const totalInvertido = filteredData.reduce((acc, v) => acc + (v.totalAmount || 0), 0);
    const totals = {
      'TOTAL': totalInvertido
    };

    const dataToExport = filteredData.map((v) => ({
      'FECHA': formatToDate(v.issueDate),
      'PLACA': v.vehiclePlate || "N/A",
      'TIPO DOC': DOC_TYPES[v.docType as DocTypeCode]?.label ?? v.docType,
      'SERIE': v.series,
      'NÚMERO': String(v.correlativeNumber).padStart(6, '0'),

      'CLIENTE': v.clienteNombre,
      'USUARIO': v.vendedor,
      'OBSERVACIONES': v.observaciones || "-",
      'TOTAL': Number(v.totalAmount || 0), 
  }));

    await exportToExcel(dataToExport, `Historial_Vehicular${plateFilter}`, totals, 'historial_vehiculos');
  };

  return (
    <div className="flex flex-col gap-6">
      <section className={styles.cardFilters}>
        <div className={styles.dateGroup}>
          <FormField label="Buscar por Placa">
            <Input
              placeholder="Ej: ABC-123"
              value={plateFilter}
              onChange={(e) => setPlateFilter(e.target.value)}
              className="uppercase"
            />
          </FormField>
        </div>
      </section>

      <div className={styles.cardActions}>
        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={filteredData.length === 0}
          className={styles.btnDownload}
        >
          Exportar Historial (Excel)
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.excelTable}>
          <thead>
            <tr>
              <th className={styles.thBase}>Fecha</th>
              <th className={styles.thBase}>Tipo</th>
              <th className={styles.thBase}>Documento</th>
              <th className={styles.thBase}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((v) => (
                <tr key={v.id}>
                  <td>{formatToDate(v.issueDate)}</td>
                  <td>{v.series}-{String(v.correlativeNumber).padStart(6, '0')}</td>
                  <td className="text-sm italic">{v.observaciones}</td>
                  <td className="font-bold">S/ {v.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-slate-400 text-center">
                  {plateFilter ? "No se encontraron servicios para esta placa." : "Ingrese una placa para ver su historial."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};