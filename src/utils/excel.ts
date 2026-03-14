import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
type ReportId = 'ventas_general' | 'productos_vendidos' | 'historial_vehiculos' | 'clientes_frecuentes';

export const exportToExcel = async (data: any[], fileName: string, totals: any, reportId: ReportId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('REPORTE');

    if (data.length > 0) {
        // --- CONFIGURACIÓN REPORTE ---
        const configs = {
            ventas_general: {
                merge: { start: 17, end: 18 },
                moneyCols: [19, 20, 21, 22],
                label: 'TOTAL SOLES (S/.)'
            },
            productos_vendidos: {
                merge: { start: 5, end: 4 },
                moneyCols: [5],
                label: 'RESUMEN TOTAL'
            },
            historial_vehiculos: {
                merge: { start: 7, end: 8 },
                moneyCols: [9],
                label: 'RESUMEN HISTORIAL'
            },
            clientes_frecuentes: {
                merge: { start: 1, end: 2 },
                moneyCols: [4],
                label: 'TOTAL POR CLIENTES'
            }
        };

        const config = configs[reportId];

        // --- CONFIGURAR COLUMNAS ---
        const columns = Object.keys(data[0]).map(key => ({
            header: key.toUpperCase(),
            key: key,
            width: key.includes('NOMBRE') || key.includes('PRODUCTO') || key.includes('OBSERV') ? 40 : 18
        }));
        worksheet.columns = columns;
        worksheet.addRows(data);

        // --- FILA DE TOTALES ---
        if (totals) {
            const totalRowValues: any = {};
            const firstColKey = columns[config.merge.start - 1].key;
            totalRowValues[firstColKey] = config.label;

            Object.keys(totals).forEach(key => {
                if (key !== 'label') {
                    totalRowValues[key.toUpperCase()] = totals[key];
                }
            });

            const totalRow = worksheet.addRow(totalRowValues);
            const rowNum = totalRow.number;

            // Celda de texto fusionada
            worksheet.mergeCells(rowNum, config.merge.start, rowNum, config.merge.end);

            // --- ESTILOS DE LA FILA AZUL ---
            totalRow.eachCell((cell, colNumber) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '2563EB' }
                };
                cell.alignment = { horizontal: 'right', vertical: 'middle' }; // Todo a la derecha
                cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' } };

                if (config.moneyCols.includes(colNumber)) {
                    cell.numFmt = '"S/ " #,##0.00';
                }
            });
        }

        // --- ESTILO DE ENCABEZADO ---
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
            cell.alignment = { horizontal: 'center' };
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};