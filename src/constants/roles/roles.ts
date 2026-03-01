/**
 * Centralización de los roles del sistema.
 * Si en el futuro se necesita cambiar el nombre visible o el valor de un rol,
 * solo debes hacerlo aquí y toda la aplicación se actualizará automáticamente.
 */
export enum UserRole {
    OWNER = 'DUEÑO',
    ADMIN = 'ADMINISTRADOR',
    SELLER = 'VENDEDOR',
    CASHIER = 'CAJERO',
}