import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@data/LocalDB";
import { logout } from "@store/slices/authSlice";
import { type RootState } from "@store/index";
import { useActiveBranch } from "@hooks/useActiveBranch";

export const useMainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);

    const { activeBranchId, setBranch } = useActiveBranch();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [constructionModal, setConstructionModal] = useState({ isOpen: false, moduleName: '' });

    const dbData = useLiveQuery(async () => {
        const company = await db.company.toCollection().first();
        const branches = await db.branches.filter(b => b.deletedAt === null).toArray();
        return { company, branches };
    }, []) || { company: undefined, branches: [] };

    const availableBranches = useMemo(() => {
        if (!user) return [];

        if (user.rol === 'OWNER' || user.rol === 'ADMIN') {
            return dbData.branches;
        } else {
            return dbData.branches.filter(b => user.branchIds?.includes(b.id));
        }
    }, [user, dbData.branches]);

    useEffect(() => {
        if (!activeBranchId && availableBranches.length > 0) {
            setBranch(availableBranches[0].id);
        }
    }, [availableBranches, activeBranchId, setBranch]);

    const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBranchId = e.target.value;
        setBranch(newBranchId);
        // console.log("Cambiando a sucursal activa GLOBAL:", newBranchId);
    };

    const requestLogout = () => setIsLogoutModalOpen(true);
    const cancelLogout = () => setIsLogoutModalOpen(false);

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        localStorage.removeItem('activeBranchId');
        dispatch(logout());
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/settings");
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

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
        selectedBranchId: activeBranchId,
        handleBranchChange,
        isLogoutModalOpen,
        requestLogout,
        cancelLogout,
        confirmLogout,
        handleProfileClick,
        isSidebarCollapsed,
        toggleSidebar,
        constructionModal,
        openConstructionModal,
        closeConstructionModal
    };
};