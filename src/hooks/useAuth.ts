import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { db } from '../data/db';

export const useAuth = () => {
    const dispatch = useDispatch();
    // Valores por defecto para probar rápido
    const [email, setEmail] = useState('carlos@elmotors.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulamos la latencia de un servidor real
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Validamos contra nuestro mock de Base de Datos
        const user = db.users.find(u => u.email === email);

        // Simulamos que la contraseña correcta para todos en el prototipo es 123456
        if (user && password === '123456') {
            // Si es exitoso, despachamos el token a Redux (Esto activa el Persist y el Router)
            dispatch(loginSuccess(`mock-jwt-token-para-${user.id}`));
        } else {
            setError('Credenciales incorrectas. Verifica tu correo o contraseña.');
        }

        setIsLoading(false);
    };

    return {
        email, setEmail,
        password, setPassword,
        error, isLoading,
        handleLogin
    };
};