import { useAuth } from '@hooks/useAuth';
import { UserRole } from '@constants/roles/roles';

export const usePermissions = () => {
    const { user } = useAuth();
    const rol = user?.rol || null;

    // 1. Configuración de Empresa (RUC, Logo, Cuentas)
    // Solo el Dueño puede cambiar los datos legales de la empresa.
    const canConfigureCompany = rol === UserRole.OWNER;

    // 2. Gestión de Usuarios
    // Solo el Dueño puede crear a otros cajeros o vendedores
    const canManageUsers = rol === UserRole.OWNER;

    // 3. Permisos sobre PRODUCTOS
    // Cajero y Vendedor NO pueden añadir ni eliminar, pero sí visualizar.
    const canAddProducts = rol === UserRole.OWNER || rol === UserRole.ADMIN;
    const canDeleteProducts = rol === UserRole.OWNER || rol === UserRole.ADMIN;
    // Según indicaste, el cajero/vendedor SÍ puede editar precios de productos existentes.
    const canEditProducts = true;

    // 4. Permisos sobre CLIENTES y VEHÍCULOS
    // Todos pueden crear y editar (para agilizar ventas)
    const canAddClientsAndVehicles = true;
    const canEditClientsAndVehicles = true;
    // Solo gerencia puede eliminar de la base de datos
    const canDeleteClientsAndVehicles = rol === UserRole.OWNER || rol === UserRole.ADMIN;

    // 5. Permisos de FACTURACIÓN
    // Todos pueden emitir boletas y facturas
    const canEmitInvoices = true;
    const canAnularInvoices = rol === UserRole.OWNER || rol === UserRole.ADMIN; // Las anulaciones suelen ser delicadas

    return {
        canConfigureCompany,
        canManageUsers,
        canAddProducts,
        canDeleteProducts,
        canEditProducts,
        canAddClientsAndVehicles,
        canEditClientsAndVehicles,
        canDeleteClientsAndVehicles,
        canEmitInvoices,
        canAnularInvoices
    };
};