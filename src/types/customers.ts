/**
 * Interfaz que define la estructura del formulario de Clientes.
 * Se mantiene separada de la BD para manejar traducciones de UI (ej. 'nombreRazonSocial' a 'name').
 */
export interface CustomerFormData {
    tipoDocumentoIdentidad: string;
    numeroDocumento: string;
    nombreRazonSocial: string;
    direccion: string;
    telefono: string;
    email: string;
}