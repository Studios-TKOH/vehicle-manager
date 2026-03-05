/**
 * Interfaz que define la estructura del formulario de Vehículos.
 * Desacoplado de la UI para mantener el tipado estricto.
 */
export interface VehicleFormData {
    customerId: string; // ID del Cliente Propietario (Obligatorio)
    conductorHabitualId: string; // ID del Conductor Habitual (Opcional)
    licensePlate: string;
    brand: string;
    model: string;
    year: number | ''; // Permite string vacío para el formulario antes de llenarlo
    mileage: number | '';
    notes?: string;
}