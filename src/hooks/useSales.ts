import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type CustomerEntity, type ProductEntity, type DocumentSeriesEntity, type SaleEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';
import { getDecolectaData } from '@services/decolectaService';

export type DocType = '01' | '03' | 'PR';

export interface CartItem extends ProductEntity {
    tempId: string;
    cantidad: number;
    notaItem?: string;
}

export const useSales = () => {
    const location = useLocation();
    // 1. Extraemos tanto deviceId como user de la sesión
    const { deviceId, user } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');
    const currentCompanyId = user?.companyId;

    const prefill = location.state?.prefillData;

    const [saleError, setSaleError] = useState<string | null>(null);
    const [isSearchingApi, setIsSearchingApi] = useState(false);

    const dbData = useLiveQuery(async () => {
        const customers = await db.customers.filter(c => c.deletedAt === null).toArray();
        const products = await db.products.filter(p => p.deletedAt === null && p.isActive).toArray();
        const series = await db.documentSeries.filter(s => s.deletedAt === null && s.active).toArray();
        return { customers, products, series };
    }, []) || { customers: [], products: [], series: [] };

    const [docTypeState, setDocTypeState] = useState<DocType>(prefill?.docType || '03');
    const [selectedSeries, setSelectedSeries] = useState<DocumentSeriesEntity | null>(null);
    const [selectedCustomerInternal, setSelectedCustomerInternal] = useState<CustomerEntity | null>(null);

    const [extras, setExtras] = useState({
        vehicleId: prefill?.vehicleId || "",
        placa: prefill?.placa || "",
        kilometrajeActual: prefill?.kilometrajeActual || "",
        proximoCambioKm: prefill?.kmProximo || "",
        observaciones: prefill?.observacionSugerida || "",
        condicionPago: "CONTADO",
    });

    const [cart, setCart] = useState<CartItem[]>([]);
    const [productSearch, setProductSearch] = useState("");
    const [inlineInputs, setInlineInputs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (prefill && dbData.customers.length > 0) {
            if (prefill.customerId && !selectedCustomerInternal) {
                const customer = dbData.customers.find(c => c.id === prefill.customerId);
                if (customer) handleSelectCustomer(customer);
            }

            if (prefill.cartItems && cart.length === 0) {
                const mappedCart = prefill.cartItems.map((item: any) => ({
                    ...item,
                    tempId: uuidv4(),
                    cantidad: item.cantidad || 1,
                }));
                setCart(mappedCart);
            }
        }
    }, [prefill, dbData.customers]);

    // ==========================================
    // MAGIA 1: Auto-asignación de Factura/Boleta
    // ==========================================
    const handleSelectCustomer = (customer: CustomerEntity | null) => {
        setSelectedCustomerInternal(customer);
        if (customer && docTypeState !== 'PR') {
            // Si eligen RUC (6), auto-cambiamos a Factura (01)
            if (customer.identityDocType === '6') {
                setDocTypeState('01');
            }
            // Si eligen DNI/CE, auto-cambiamos a Boleta (03)
            else {
                setDocTypeState('03');
            }
        }
    };

    // ==========================================
    // MAGIA 2: Validación al cambiar DocType manual
    // ==========================================
    const handleSetDocType = (type: DocType) => {
        if (selectedCustomerInternal && type !== 'PR') {
            if (type === '01' && selectedCustomerInternal.identityDocType !== '6') {
                setSaleError("Las facturas (01) exigen que el cliente tenga un RUC. Se ha deseleccionado al cliente actual.");
                setSelectedCustomerInternal(null);
            } else if (type === '03' && selectedCustomerInternal.identityDocType === '6') {
                setSaleError("Por regulación, las empresas con RUC deben recibir Factura (01), no Boleta. Se ha deseleccionado al cliente.");
                setSelectedCustomerInternal(null);
            }
        }
        setDocTypeState(type);
    };

    // Efecto para asignar serie basado en el tipo de documento
    useEffect(() => {
        const availableSeries = dbData.series.filter(s => s.docType === docTypeState);
        if (availableSeries.length > 0) {
            setSelectedSeries(availableSeries[0]);
        } else {
            setSelectedSeries(null);
        }
    }, [docTypeState, dbData.series]);


    // ==========================================
    // MAGIA 3: Buscar en SUNAT/RENIEC y Guardar
    // ==========================================
    const handleSearchApiCustomer = async (documentNumber: string) => {
        const cleanDoc = documentNumber.trim();
        if (cleanDoc.length !== 8 && cleanDoc.length !== 11) {
            setSaleError("El documento debe tener 8 (DNI) u 11 (RUC) dígitos para la búsqueda.");
            return false;
        }

        if (!currentDeviceId || !currentCompanyId) {
            setSaleError("Error de sesión. No se puede guardar el cliente localmente.");
            return false;
        }

        const tipoDoc = cleanDoc.length === 11 ? '6' : '1';
        setIsSearchingApi(true);

        try {
            // 1. Verificamos si ya existe en la base de datos local (Para no llamar a la API en vano)
            const localCustomer = await db.customers
                .filter(c => c.identityDocNumber === cleanDoc && c.deletedAt === null)
                .first();

            if (localCustomer) {
                handleSelectCustomer(localCustomer);
                return true;
            }

            // 2. Si no existe, Consultamos Decolecta
            const data = await getDecolectaData(tipoDoc, cleanDoc);

            if (data) {
                const now = new Date().toISOString();
                const newCustomer: CustomerEntity = {
                    id: uuidv4(),
                    companyId: currentCompanyId,
                    identityDocType: tipoDoc,
                    identityDocNumber: cleanDoc,
                    name: data.name,
                    address: data.address || null,
                    phone: null,
                    email: null,
                    isActive: true,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: null,
                    version: 1
                };

                // Guardar en Dexie y encolar en el Outbox para subirse a la nube
                await db.transaction('rw', db.customers, db.outboxEvents, async () => {
                    await db.customers.add(newCustomer);
                    await db.outboxEvents.add({
                        id: uuidv4(), deviceId: currentDeviceId, entityType: 'customer', entityId: newCustomer.id,
                        operation: 'UPSERT', payloadJson: JSON.stringify(newCustomer), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                    });
                });

                // Lo seleccionamos automáticamente (lo que disparará el cambio a Factura/Boleta)
                handleSelectCustomer(newCustomer);
                return true;
            } else {
                setSaleError("No se encontraron resultados en SUNAT/RENIEC para este documento.");
                return false;
            }
        } catch (error) {
            console.error(error);
            setSaleError("Error de red al consultar el documento.");
            return false;
        } finally {
            setIsSearchingApi(false);
        }
    };

    const addItem = (product: ProductEntity) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, tempId: uuidv4(), cantidad: 1 }]);
        }
        setProductSearch("");
    };

    const removeItem = (tempId: string) => {
        setCart(cart.filter(item => item.tempId !== tempId));
    };

    const updateQuantity = (tempId: string, qty: number) => {
        setCart(cart.map(item => item.tempId === tempId ? { ...item, cantidad: Math.max(1, qty) } : item));
    };

    const totals = useMemo(() => {
        let subtotal = 0;
        let igv = 0;
        let total = 0;

        cart.forEach(item => {
            const lineTotal = item.price * item.cantidad;
            const lineSubtotal = lineTotal / 1.18;
            const lineIgv = lineTotal - lineSubtotal;

            subtotal += lineSubtotal;
            igv += lineIgv;
            total += lineTotal;
        });

        return { subtotal, igv, total };
    }, [cart]);

    const handleExtraChange = (key: string, value: string) => setExtras(prev => ({ ...prev, [key]: value }));
    const toggleInlineInput = (key: string) => setInlineInputs(prev => ({ ...prev, [key]: true }));
    const blurInlineInput = (key: string) => setInlineInputs(prev => ({ ...prev, [key]: false }));

    const processSale = async () => {
        if (!currentDeviceId || !currentCompanyId) {
            setSaleError("Error de seguridad: Sesión de dispositivo no válida.");
            return null;
        }
        if (!selectedCustomerInternal && docTypeState !== 'PR') {
            setSaleError("Para emitir un comprobante válido para SUNAT, debes seleccionar un cliente.");
            return null;
        }
        if (cart.length === 0) {
            setSaleError("El carrito está vacío. Añade al menos un producto para facturar.");
            return null;
        }
        if (docTypeState !== 'PR' && !selectedSeries) {
            setSaleError("No tienes una serie de facturación configurada para este tipo de documento en esta sucursal.");
            return null;
        }

        const now = new Date().toISOString();
        const saleId = uuidv4();

        const finalCustomerId = selectedCustomerInternal?.id || 'CLIENTE_GENERICO_ID';

        const saleToSave: SaleEntity = {
            id: saleId,
            companyId: currentCompanyId, // <-- Ya aseguramos que proviene de la sesión real
            branchId: selectedSeries?.branchId || 'DEFAULT_BRANCH',
            customerId: finalCustomerId,
            vehicleId: extras.vehicleId || null,
            docType: docTypeState,
            series: selectedSeries?.series || 'P001',
            correlativeNumber: selectedSeries ? selectedSeries.nextCorrelative : Date.now(),
            issueDate: now,
            currency: 'PEN',
            subtotalAmount: Number(totals.subtotal.toFixed(2)),
            igvAmount: Number(totals.igv.toFixed(2)),
            totalAmount: Number(totals.total.toFixed(2)),
            currentMileage: extras.kilometrajeActual ? Number(extras.kilometrajeActual) : null,
            nextMaintenanceMileage: extras.proximoCambioKm ? Number(extras.proximoCambioKm) : null,
            notes: extras.observaciones || null,
            status: docTypeState === 'PR' ? 'DRAFT' : 'CONFIRMED',
            sunatStatus: 'NOT_SENT',
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            version: 1
        };

        const saleDetailsToSave = cart.map(item => {
            const lineTotal = item.price * item.cantidad;
            const lineSubtotal = lineTotal / 1.18;
            const lineIgv = lineTotal - lineSubtotal;

            return {
                id: uuidv4(),
                saleId: saleId,
                productId: item.id,
                descriptionSnapshot: item.name,
                quantity: item.cantidad,
                unitValueNoIgv: Number((item.price / 1.18).toFixed(6)),
                unitPriceWithIgv: item.price,
                lineSubtotalNoIgv: Number(lineSubtotal.toFixed(2)),
                lineIgv: Number(lineIgv.toFixed(2)),
                lineTotalWithIgv: Number(lineTotal.toFixed(2)),
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
                version: 1
            };
        });

        try {
            await db.transaction('rw', db.sales, db.saleDetails, db.documentSeries, db.outboxEvents, async () => {
                await db.sales.add(saleToSave);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'sale', entityId: saleId,
                    operation: 'UPSERT', payloadJson: JSON.stringify(saleToSave), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });

                for (const detail of saleDetailsToSave) {
                    await db.saleDetails.add(detail);
                    await db.outboxEvents.add({
                        id: uuidv4(), deviceId: currentDeviceId, entityType: 'saleDetail', entityId: detail.id,
                        operation: 'UPSERT', payloadJson: JSON.stringify(detail), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                    });
                }

                if (selectedSeries && docTypeState !== 'PR') {
                    const updatedSeries = { ...selectedSeries, nextCorrelative: selectedSeries.nextCorrelative + 1, updatedAt: now };
                    await db.documentSeries.put(updatedSeries);
                }
            });

            return {
                docType: docTypeState,
                series: saleToSave.series,
                correlativeNumber: saleToSave.correlativeNumber,
                customerName: selectedCustomerInternal ? selectedCustomerInternal.name : 'Público en General',
                totalAmount: saleToSave.totalAmount
            };
        } catch (error) {
            console.error("Error al procesar la venta:", error);
            setSaleError("Ocurrió un error inesperado al intentar guardar el documento en la base de datos.");
            return null;
        }
    };

    return {
        customers: dbData.customers,
        products: dbData.products,
        docType: docTypeState,
        setDocType: handleSetDocType,
        selectedSeries,
        selectedCustomer: selectedCustomerInternal,
        setSelectedCustomer: handleSelectCustomer,
        extras,
        handleExtraChange,
        inlineInputs,
        toggleInlineInput,
        blurInlineInput,
        cart,
        productSearch,
        setProductSearch,
        totals,
        addItem,
        removeItem,
        updateQuantity,
        processSale,
        saleError,
        setSaleError,
        isSearchingApi,
        handleSearchApiCustomer
    };
};