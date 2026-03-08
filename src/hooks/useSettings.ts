import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@data/LocalDB';

export const useSettings = () => {
    const [activeTab, setActiveTab] = useState<'empresa' | 'sucursales' | 'series' | 'usuarios'>('empresa');

    // Mantenemos solo lo que aún no hemos modularizado
    const dbData = useLiveQuery(async () => {
        const series = await db.documentSeries.filter(s => s.deletedAt === null && s.active).toArray();
        const users = await db.users.filter(u => u.deletedAt === null && u.activo).toArray();
        return { series, users };
    }, []) || { series: [], users: [] };

    return {
        activeTab,
        setActiveTab,
        seriesData: dbData.series,
        usersData: dbData.users
    };
};