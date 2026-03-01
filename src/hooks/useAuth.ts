import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout, completeOnboarding, type User } from '../store/slices/authSlice';
import { usersData } from '../data/mock/users';
import { UserRole } from '../constants/roles/roles';

export const useAuth = () => {
    const dispatch = useDispatch();
    // Extraemos el estado global de autenticación de Redux (incluye isLoading y error)
    const authState = useSelector((state: RootState) => state.auth);

    // Valores por defecto para probar rápido el prototipo
    const [email, setEmail] = useState('carlos@elmotors.com');
    const [password, setPassword] = useState('123456');

    // SIMULACIÓN DE LOGIN
    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        dispatch(loginStart()); // Activa el isLoading de Redux y limpia errores

        try {
            // Simulamos la latencia de un servidor real
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Validamos contra nuestro mock de usuarios normalizado
            const userFound = usersData.users.find(u => u.email === email.toLowerCase());

            // Validamos que el usuario exista y la contraseña sea 123456
            if (userFound && password === '123456') {

                // Si es exitoso, enviamos al slice de Redux el usuario y su Token
                dispatch(loginSuccess({
                    user: userFound as User,
                    isNew: false,
                    token: `mock-jwt-token-para-${userFound.id}`
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

    // SIMULACIÓN DE REGISTRO (Primer uso del sistema por el Dueño)
    const register = async (nombreNuevo: string, emailNuevo: string, passwordNuevo?: string) => {
        dispatch(loginStart());
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const userExists = usersData.users.find((u) => u.email === emailNuevo.toLowerCase());
            if (userExists) {
                dispatch(loginFailure('Este correo ya está registrado en el sistema.'));
                return false;
            }

            const newUser: User = {
                id: `user-new-${Date.now()}`,
                branchId: null,
                nombre: nombreNuevo,
                email: emailNuevo.toLowerCase(),
                rol: UserRole.OWNER, // Al registrarse, es DUEÑO por defecto
            };

            // Iniciamos sesión automáticamente y asignamos isNew en true
            dispatch(loginSuccess({
                user: newUser,
                isNew: true,
                token: `mock-jwt-token-new-${newUser.id}`
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
        ...authState, // Esparce: user, token, isAuthenticated, isLoading, error, needsOnboarding
        email, setEmail,
        password, setPassword,
        handleLogin,
        register,
        logout: handleLogout,
        finishOnboarding
    };
};