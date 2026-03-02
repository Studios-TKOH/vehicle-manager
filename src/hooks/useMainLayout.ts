import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@store/slices/authSlice";
import { type RootState } from "@store/index";
import { branchesData } from "@data/mock/branches";
import { companyData } from "@data/mock/company";

export const useMainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");

    // Obtenemos las sucursales disponibles desde el mock desacoplado
    const availableBranches = useMemo(() => {
        if (!user) return [];
        // DUEÑO o ADMIN ven todas. VENDEDOR/CAJERO ven las que tienen asignadas en su arreglo branchIds.
        if (user.rol === 'DUEÑO' || user.rol === 'ADMINISTRADOR') {
            return branchesData.branches;
        } else {
            return branchesData.branches.filter(b => user.branchIds?.includes(b.id));
        }
    }, [user]);

    useEffect(() => {
        if (!selectedBranchId && availableBranches.length > 0) {
            setSelectedBranchId(availableBranches[0].id);
        }
    }, [availableBranches, selectedBranchId]);

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setSelectedBranchId(newBranchId);
        console.log("Cambiando a sucursal activa:", newBranchId);
        // Aquí se despacharía una acción a Redux en el futuro para saber en qué sucursal estamos facturando
    };

    const requestLogout = () => setIsLogoutModalOpen(true);
    const cancelLogout = () => setIsLogoutModalOpen(false);

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        dispatch(logout());
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/settings");
    };

    return {
        user,
        companyInfo: companyData.company, // Pasamos la data de la empresa también
        availableBranches,
        selectedBranchId,
        handleBranchChange,
        isLogoutModalOpen,
        requestLogout,
        cancelLogout,
        confirmLogout,
        handleProfileClick
    };
};