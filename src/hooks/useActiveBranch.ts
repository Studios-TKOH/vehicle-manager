import { useState, useEffect } from 'react';

export const useActiveBranch = () => {
    const [activeBranchId, setActiveBranchId] = useState<string>(() => {
        return localStorage.getItem('activeBranchId') || '';
    });

    const setBranch = (branchId: string) => {
        localStorage.setItem('activeBranchId', branchId);
        setActiveBranchId(branchId);

        window.dispatchEvent(new Event('branch-changed'));
    };

    useEffect(() => {
        const handleBranchChange = () => {
            setActiveBranchId(localStorage.getItem('activeBranchId') || '');
        };

        window.addEventListener('branch-changed', handleBranchChange);
        return () => window.removeEventListener('branch-changed', handleBranchChange);
    }, []);

    return { activeBranchId, setBranch };
};