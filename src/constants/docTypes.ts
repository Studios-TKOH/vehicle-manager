export const DOC_TYPES = {
    //'00': { label: 'Proforma Electrónica', type: 'PROFORMA' },
    '01': { label: 'Factura Electrónica', type: 'FACTURA' },
    '03': { label: 'Boleta de Venta Electrónica', type: 'BOLETA DE VENTA' },
    //'07': { label: 'Nota de Crédito Electrónica', type: 'NOTA DE CRÉDITO' },
    //'08': { label: 'Nota de Débito Electrónica', type: 'NOTA DE DÉBITO' },
    //'09': { label: 'Guía de Remisión Remitente Electrónica', type: 'GUÍA DE REMISIÓN REMITENTE' },
} as const;

export type DocTypeCode = keyof typeof DOC_TYPES;

export const NOTE_REASONS = {
    CREDIT: {
        '01': 'Anulación de la operación',
        '02': 'Anulación por error en el RUC',
        '03': 'Corrección por error en la descripción',
        '04': 'Descuento global',
        '05': 'Descuento por ítem',
        '06': 'Devolución total',
        '07': 'Devolución por ítem',
        '08': 'Bonificación',
        '09': 'Disminución en el valor',
        '10': 'Otros conceptos',
    },
    DEBIT: {
        '01': 'Intereses por mora',
        '02': 'Aumento en el valor',
        '03': 'Otros conceptos',
    }
} as const;

export const getDocTypeName = (code: string): string | undefined => {
    return DOC_TYPES[code as DocTypeCode]?.label;
};

export const getDocType = (code: string): string | undefined => {
    return DOC_TYPES[code as DocTypeCode]?.type;
};