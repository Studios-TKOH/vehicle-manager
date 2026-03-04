// --- DTOs para Integración con Decolecta ---
export interface DecolectaRucResponseDTO {
    razon_social: string;
    numero_documento: string;
    estado: string;
    condicion: string;
    direccion: string;
    ubigeo?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
}

export interface DecolectaDniResponseDTO {
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    full_name: string;
    document_number: string;
}

export interface DecolectaErrorDTO {
    error: string;
}

// Estructura normalizada que nuestro UI consumirá
export interface DecolectaNormalizedResponse {
    name: string;
    address: string | null;
}