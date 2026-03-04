import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'; // Generador de UUIDs reales
import { type RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, completeOnboarding, type User } from '../store/slices/authSlice';
import { usersData } from '@data/mock/users';
import { UserRole } from '@constants/roles/roles';
import { getOrCreateDeviceId } from '../utils/device';

export const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('carlos@elmotors.com');
    const [password, setPassword] = useState('123456');

    // --- SIMULACIÓN DE LOGIN ---
    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        dispatch(loginStart());

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userFound = usersData.users.find(u => u.email === email.toLowerCase());

            if (userFound && password === '123456') {
                const deviceId = getOrCreateDeviceId();

                // Adaptamos el mock a la estructura estricta del DTO
                const userPayload: User = {
                    id: userFound.id,
                    // Si el JSON de mock no lo tiene, forzamos un ID, pero idealmente 
                    // ya viene de tu BD backend.
                    companyId: (userFound as any).companyId || 'COMP-MOCK-1234',
                    branchIds: userFound.branchIds || [],
                    nombre: userFound.nombre,
                    email: userFound.email,
                    rol: userFound.rol as UserRole,
                };

                dispatch(loginSuccess({
                    user: userPayload,
                    isNew: false,
                    token: `mock-jwt-token-para-${userFound.id}`,
                    deviceId
                }));

                return true;
            } else {
                dispatch(loginFailure('Credenciales incorrectas. Verifica tu correo o contraseña.'));
                return false;
            }
        } catch (error) {
            dispatch(loginFailure('Ocurrió un error interno al intentar iniciar sesión.'));
            return false;
        }
    };

    // --- REGISTRO DEL PRIMER USUARIO (DUEÑO REAL) ---
    const register = async (nombreNuevo: string, emailNuevo: string, passwordNuevo?: string) => {
        dispatch(loginStart());
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const userExists = usersData.users.find((u) => u.email === emailNuevo.toLowerCase());
            if (userExists) {
                dispatch(loginFailure('Este correo ya está registrado en el sistema.'));
                return false;
            }

            // Aquí creamos la estructura fundacional real
            const newCompanyId = uuidv4(); // Nace una nueva empresa
            const newUserId = uuidv4();    // Nace su dueño
            const deviceId = getOrCreateDeviceId(); // Obtenemos la máquina en la que está

            const newUser: User = {
                id: newUserId,
                companyId: newCompanyId,
                branchIds: [], // Inicialmente no tiene sucursales hasta que las configure
                nombre: nombreNuevo,
                email: emailNuevo.toLowerCase(),
                rol: UserRole.OWNER,
            };

            dispatch(loginSuccess({
                user: newUser,
                isNew: true, // Esto activará el flujo de Onboarding para configurar su RUC
                token: `mock-jwt-token-new-${newUser.id}`,
                deviceId
            }));

            return true;

        } catch (error) {
            dispatch(loginFailure('Error en el registro del sistema.'));
            return false;
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const finishOnboarding = () => {
        dispatch(completeOnboarding());
    };

    return {
        ...authState,
        email, setEmail,
        password, setPassword,
        handleLogin,
        register,
        logout: handleLogout,
        finishOnboarding
    };
};