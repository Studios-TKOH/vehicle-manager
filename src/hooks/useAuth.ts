import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { type RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, completeOnboarding, updateSessionUser, type User } from '@store/slices/authSlice';
import { usersData } from '@data/mock/users';
import { UserRole } from '@constants/roles/roles';
import { getOrCreateDeviceId } from '../utils/device';
import { db, type UserEntity, type CompanyEntity } from '@data/LocalDB';

export const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('gercermagden@gmail.com');
    const [password, setPassword] = useState('123456');

    // --- LOGIN ---
    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        dispatch(loginStart());

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            // 1. Buscar en la Base de Datos Local (Dexie)
            const localUsers = await db.users.toArray();
            let userFound: any = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            // 2. Si no existe en la BD Local, buscar en los Mocks (Fallback temporal)
            if (!userFound) {
                userFound = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            }

            if (userFound && password === '123456') { // (Validación estricta de hash se haría en el backend)
                const deviceId = getOrCreateDeviceId();

                // Adaptamos a la interfaz del Estado Global de Redux
                const userPayload: User = {
                    id: userFound.id,
                    companyId: userFound.companyId,
                    branchIds: userFound.branchIds || [],
                    nombre: userFound.nombre,
                    email: userFound.email,
                    rol: userFound.rol as UserRole,
                };

                dispatch(loginSuccess({
                    user: userPayload,
                    isNew: false,
                    token: `local-jwt-token-para-${userFound.id}`,
                    deviceId
                }));

                return true;
            } else {
                dispatch(loginFailure('Credenciales incorrectas. Verifica tu correo o contraseña.'));
                return false;
            }
        } catch (error) {
            console.error("Error en login:", error);
            dispatch(loginFailure('Ocurrió un error interno al intentar iniciar sesión.'));
            return false;
        }
    };

    // --- REGISTRO REAL EN DEXIE (OFFLINE-FIRST) ---
    const register = async (nombreNuevo: string, emailNuevo: string, passwordNuevo?: string) => {
        dispatch(loginStart());
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const emailLower = emailNuevo.toLowerCase();

            // Verificar si el correo ya existe (Local o Mock)
            const existingLocalUsers = await db.users.toArray();
            const userExistsLocal = existingLocalUsers.some(u => u.email.toLowerCase() === emailLower);
            const userExistsMock = usersData.users.some(u => u.email.toLowerCase() === emailLower);

            if (userExistsLocal || userExistsMock) {
                dispatch(loginFailure('Este correo ya está registrado en el sistema.'));
                return false;
            }

            // Generamos identificadores reales y permanentes
            const newCompanyId = uuidv4();
            const newUserId = uuidv4();
            const deviceId = getOrCreateDeviceId();
            const now = new Date().toISOString();

            // 1. Crear el cascarón vacío de la Empresa
            const newCompany: CompanyEntity = {
                id: newCompanyId,
                ruc: '',
                razonSocial: '',
                nombreComercial: '',
                direccionFiscal: '',
                ubigeo: null,
                datosBancarios: null,
                mensajeDespedidaPie: null,
                monedaPorDefecto: 'PEN',
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1
            };

            // 2. Crear la Entidad del Usuario Dueño
            const newUserEntity: UserEntity = {
                id: newUserId,
                companyId: newCompanyId,
                defaultBranchId: 'PENDING_SETUP', // Marcador temporal hasta que registre la primera sucursal
                branchIds: [],
                nombre: nombreNuevo,
                email: emailLower,
                rol: UserRole.OWNER,
                activo: true,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1
            };

            // 3. Transacción ACID Local + Patrón Outbox
            await db.transaction('rw', db.company, db.users, db.outboxEvents, async () => {

                // Guardar y encolar la Empresa
                await db.company.add(newCompany);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId, entityType: 'company', entityId: newCompanyId,
                    operation: 'UPSERT', payloadJson: JSON.stringify(newCompany),
                    clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });

                // Guardar y encolar el Usuario
                await db.users.add(newUserEntity);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId, entityType: 'user', entityId: newUserId,
                    operation: 'UPSERT', payloadJson: JSON.stringify(newUserEntity),
                    clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });
            });

            // 4. Iniciar sesión automáticamente en Redux
            const userPayload: User = {
                id: newUserId,
                companyId: newCompanyId,
                branchIds: [],
                nombre: nombreNuevo,
                email: emailLower,
                rol: UserRole.OWNER,
            };

            dispatch(loginSuccess({
                user: userPayload,
                isNew: true, // Esto activará el flujo de Onboarding visual
                token: `local-jwt-token-new-${newUserId}`,
                deviceId
            }));

            return true;

        } catch (error) {
            console.error("Error crítico al registrar en BD Local:", error);
            dispatch(loginFailure('Error al crear la cuenta en la base de datos local.'));
            return false;
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const finishOnboarding = () => {
        dispatch(completeOnboarding());
    };

    const updateSession = (updates: Partial<User>) => {
        dispatch(updateSessionUser(updates));
    };

    return {
        ...authState,
        email, setEmail,
        password, setPassword,
        handleLogin,
        register,
        logout: handleLogout,
        finishOnboarding,
        updateSession
    };
};