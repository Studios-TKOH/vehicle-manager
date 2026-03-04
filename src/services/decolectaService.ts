import type {
    DecolectaRucResponseDTO,
    DecolectaDniResponseDTO,
    DecolectaErrorDTO,
    DecolectaNormalizedResponse
} from '@/types/decolecta';

/**
 * Servicio puro para consultar datos de SUNAT/RENIEC vía Decolecta
 */
export const getDecolectaData = async (tipoDoc: string, numeroDoc: string): Promise<DecolectaNormalizedResponse | null> => {
    try {
        const token = import.meta.env.VITE_DECOLECTA_TOKEN;
        const baseUrlRuc = import.meta.env.VITE_DECOLECTA_URL_RUC_SEARCH;
        const baseUrlDni = import.meta.env.VITE_DECOLECTA_URL_DNI_SEARCH;

        if (!token) {
            console.warn("Advertencia: No se ha configurado VITE_DECOLECTA_TOKEN en el .env");
        }

        let url = "";
        if (tipoDoc === 'DNI' || tipoDoc === '1') {
            url = `${baseUrlDni}${numeroDoc}`;
        } else if (tipoDoc === 'RUC' || tipoDoc === '6') {
            url = `${baseUrlRuc}${numeroDoc}`;
        } else {
            return null;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json() as DecolectaErrorDTO;
            console.warn(`Decolecta API Error: Status ${response.status} - ${errorData.error || 'Inválido'}`);
            return null;
        }

        const data = await response.json();

        // Parseo DTO RUC
        if ((tipoDoc === 'RUC' || tipoDoc === '6') && data.numero_documento) {
            const rucData = data as DecolectaRucResponseDTO;
            return {
                name: rucData.razon_social,
                address: rucData.direccion || null,
            };
        }

        // Parseo DTO DNI
        if ((tipoDoc === 'DNI' || tipoDoc === '1') && data.document_number) {
            const dniData = data as DecolectaDniResponseDTO;
            return {
                name: dniData.full_name,
                address: null,
            };
        }

        return null;
    } catch (error) {
        console.error("Error de red o CORS al consultar Decolecta:", error);
        return null;
    }
};