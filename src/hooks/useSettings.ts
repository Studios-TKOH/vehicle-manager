import { useState } from 'react';

export type SettingsTab = 'empresa' | 'sucursales' | 'series' | 'usuarios';

export const useSettings = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('empresa');

    return {
        activeTab,
        setActiveTab
    };
};