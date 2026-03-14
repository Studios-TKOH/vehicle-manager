export const formatToDate = (dateStr?: string | null): string => {
    if (!dateStr || dateStr.trim() === "") return "-";

    const normalizedDate = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
    const date = new Date(normalizedDate);

    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const formatToDateTime = (dateStr?: string | null): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).toUpperCase();
};

export const toLocalISO = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === "") return "";

    const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`;
    const date = new Date(normalized);
    
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};