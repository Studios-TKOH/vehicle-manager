/**
 * Interfaz que define la estructura del formulario de Productos.
 * Desacoplado de la UI para mantener el tipado estricto.
 */
export interface ProductFormData {
    code: string;
    name: string;
    category: string;
    description: string;
    unitType: string;
    price: number;
    isActive: boolean;
}