import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@data/LocalDB";
import { logout } from "@store/slices/authSlice";
import { type RootState } from "@store/index";

export const useMainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // NUEVO: Estado para el modal de "En Construcción"
    const [constructionModal, setConstructionModal] = useState({ isOpen: false, moduleName: '' });

    // 1. Extraemos los datos reales de IndexedDB
    const dbData = useLiveQuery(async () => {
        const company = await db.company.toCollection().first();
        const branches = await db.branches.filter(b => b.deletedAt === null).toArray();
        return { company, branches };
    }, []) || { company: undefined, branches: [] };

    // 2. Filtramos sucursales corrigiendo el error estricto de TypeScript
    const availableBranches = useMemo(() => {
        if (!user) return [];

        // Usamos los strings exactos definidos en tu Enum/Type UserRole
        if (user.rol === 'OWNER' || user.rol === 'ADMIN') {
            return dbData.branches;
        } else {
            return dbData.branches.filter(b => user.branchIds?.includes(b.id));
        }
    }, [user, dbData.branches]);

    // Autoseleccionar la primera sucursal si no hay una seleccionada
    useEffect(() => {
        if (!selectedBranchId && availableBranches.length > 0) {
            setSelectedBranchId(availableBranches[0].id);
        }
    }, [availableBranches, selectedBranchId]);

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setSelectedBranchId(newBranchId);
        console.log("Cambiando a sucursal activa:", newBranchId);
        // TODO: Despachar acción a Redux para el estado global operativo
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

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // NUEVO: Funciones para controlar el modal de construcción
    const openConstructionModal = (moduleName: string) => {
        setConstructionModal({ isOpen: true, moduleName });
    };

    const closeConstructionModal = () => {
        setConstructionModal({ isOpen: false, moduleName: '' });
    };

    return {
        user,
        companyInfo: dbData.company,
        availableBranches,
        selectedBranchId,
        handleBranchChange,
        isLogoutModalOpen,
        requestLogout,
        cancelLogout,
        confirmLogout,
        handleProfileClick,
        isSidebarCollapsed,
        toggleSidebar,
        // Exponemos las nuevas funciones y el estado
        constructionModal,
        openConstructionModal,
        closeConstructionModal
    };
};