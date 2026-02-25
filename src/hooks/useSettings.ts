import { useState } from 'react';
import { db } from '../data/db';

export const useSettings = () => {
    const [activeTab, setActiveTab] = useState<'empresa' | 'sucursales' | 'series' | 'usuarios'>('empresa');

    // Cargamos los datos de la base de datos simulada
    const [companyData, setCompanyData] = useState(db.company);
    const [branchesData] = useState(db.branches);
    const [seriesData] = useState(db.documentSeries);
    const [usersData] = useState(db.users);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const saveCompanySettings = (e: React.FormEvent) => {
        e.preventDefault();
        alert('¡Configuración de empresa guardada con éxito! (Simulación)');
    };

    return {
        activeTab, setActiveTab,
        companyData, handleCompanyChange, saveCompanySettings,
        branchesData, seriesData, usersData
    };
};