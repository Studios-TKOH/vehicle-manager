/**
 * Centralización de los roles del sistema.
 * Valores internos limpios (sin caracteres especiales) para la Base de Datos.
 */
export enum UserRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    SELLER = 'SELLER',
    CASHIER = 'CASHIER',
}

/**
 * Diccionario para mostrar los roles en la Interfaz de Usuario (UI).
 * Uso: RoleLabels[user.rol] // Imprime "Dueño"
 */
export const RoleLabels: Record<UserRole, string> = {
    [UserRole.OWNER]: 'Dueño',
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.SELLER]: 'Vendedor',
    [UserRole.CASHIER]: 'Cajero',
};