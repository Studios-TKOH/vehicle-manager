import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type CompanyEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';

export const useCompanySettings = () => {
    const { deviceId } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const [companyData, setCompanyData] = useState<Partial<CompanyEntity>>({
        ruc: '', razonSocial: '', nombreComercial: '', direccionFiscal: '', datosBancarios: '', mensajeDespedidaPie: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Consulta reactiva a IndexedDB
    const companyDB = useLiveQuery(() => db.company.toCollection().first());

    useEffect(() => {
        if (companyDB) {
            setCompanyData(companyDB);
        }
    }, [companyDB]);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const saveCompanySettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDeviceId || !companyDB) return;

        setIsSaving(true);
        try {
            const now = new Date().toISOString();

            await db.transaction('rw', db.company, db.outboxEvents, async () => {
                const existingCompany = await db.company.get(companyDB.id);
                if (!existingCompany) return;

                const updatedCompany: CompanyEntity = {
                    ...existingCompany,
                    ruc: companyData.ruc || existingCompany.ruc,
                    razonSocial: companyData.razonSocial || existingCompany.razonSocial,
                    nombreComercial: companyData.nombreComercial || existingCompany.nombreComercial,
                    direccionFiscal: companyData.direccionFiscal || existingCompany.direccionFiscal,
                    datosBancarios: companyData.datosBancarios || null,
                    mensajeDespedidaPie: companyData.mensajeDespedidaPie || null,
                    updatedAt: now,
                    version: existingCompany.version + 1
                };

                await db.company.put(updatedCompany);
                await db.outboxEvents.add({
                    id: uuidv4(),
                    deviceId: currentDeviceId,
                    entityType: 'company',
                    entityId: updatedCompany.id,
                    operation: 'UPSERT',
                    payloadJson: JSON.stringify(updatedCompany),
                    clientUpdatedAt: now,
                    entityVersion: updatedCompany.version,
                    status: 'PENDING',
                    createdAt: now
                });
            });

            // En lugar de alert(), abrimos el modal
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error al guardar configuración:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        companyData,
        handleCompanyChange,
        saveCompanySettings,
        isSaving,
        showSuccessModal,
        setShowSuccessModal
    };
};