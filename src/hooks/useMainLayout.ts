import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export const useMainLayout = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Aquí en el futuro podríamos agregar lógica extra, 
        // como limpiar bases de datos locales al salir o mostrar un modal de confirmación
        dispatch(logout());
    };

    return {
        handleLogout,
    };
};