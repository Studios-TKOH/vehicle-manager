import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (data: any[], fileName: string, totals?: any) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('REPORTE DE VENTAS');

    if (data.length > 0) {
        const columns = Object.keys(data[0]).map(key => ({
            header: key.toUpperCase(),
            key: key,
            width: 20
        }));
        worksheet.columns = columns;

        worksheet.addRows(data);

        if (totals) {
            const lastRow = worksheet.addRow({
                'OTROS': 'TOTAL SOLES (S/.)',
                'DESCUENTO': totals.descuento,
                'GRAVADO': totals.gravado,
                'IGV': totals.igv,
                'TOTAL': totals.total
            });

            const rowNum = lastRow.number;

            worksheet.mergeCells(rowNum, 17, rowNum, 18);

            lastRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '2563EB' } 
                };
                
                cell.alignment = { horizontal: 'right',vertical: 'middle' };
                
                if (cell.value && typeof cell.value === 'number') {
                    cell.numFmt = '"S/ " #,##0.00';
                }

                cell.border = {
                    top: { style: 'medium', color: { argb: '000000' } },
                    bottom: { style: 'medium', color: { argb: '000000' } }
                };
            });
        }

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '2563EB' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell((cell) => {
                    if (!cell.border) {
                        cell.border = {
                            bottom: { style: 'thin', color: { argb: 'E2E8F0' } }
                        };
                    }
                });
            }
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};