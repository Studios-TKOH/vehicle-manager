import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type CustomerEntity, type ProductEntity, type DocumentSeriesEntity, type SaleEntity, type VehicleEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';
import { getDecolectaData } from '@services/decolectaService';
import { useActiveBranch } from '@hooks/useActiveBranch';

export type DocType = '01' | '03' | 'PR';

export interface CartItem extends ProductEntity {
    tempId: string;
    cantidad: number;
    notaItem?: string;
}

export const useSales = () => {
    const location = useLocation();
    const { deviceId, user } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');
    const currentCompanyId = user?.companyId;

    const { activeBranchId } = useActiveBranch();

    const prefill = location.state?.prefillData;

    const [saleError, setSaleError] = useState<string | null>(null);
    const [isSearchingApi, setIsSearchingApi] = useState(false);

    const [globalDiscount, setGlobalDiscount] = useState<number>(0);

    const today = new Date();
    const minD = new Date(today); minD.setDate(today.getDate() - 3);
    const maxD = new Date(today); maxD.setDate(today.getDate() + 3);

    const [issueDate, setIssueDate] = useState<string>(today.toISOString().split("T")[0]);
    const minDate = minD.toISOString().split('T')[0];
    const maxDate = maxD.toISOString().split('T')[0];

    const dbData = useLiveQuery(async () => {
        if (!activeBranchId) return { customers: [], products: [], series: [] };

        const customers = await db.customers.filter(c => c.deletedAt === null).toArray();
        const products = await db.products.filter(p => p.deletedAt === null && p.isActive).toArray();

        const series = await db.documentSeries.filter(s =>
            s.deletedAt === null &&
            s.active &&
            s.branchId === activeBranchId
        ).toArray();

        return { customers, products, series };
    }, [activeBranchId]) || { customers: [], products: [], series: [] };

    const [docTypeState, setDocTypeState] = useState<DocType>(prefill?.docType || '03');
    const [selectedSeries, setSelectedSeries] = useState<DocumentSeriesEntity | null>(null);
    const [selectedCustomerInternal, setSelectedCustomerInternal] = useState<CustomerEntity | null>(null);

    const initialExtras = {
        vehicleId: prefill?.vehicleId || "",
        placa: prefill?.placa || "",
        kilometrajeActual: prefill?.kilometrajeActual || "",
        proximoCambioKm: prefill?.kmProximo || "",
        observaciones: prefill?.observacionSugerida || "",
        condicionPago: "CONTADO",
        ordenCompra: "",
        guiaRemision: ""
    };

    const [extras, setExtras] = useState(initialExtras);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [productSearch, setProductSearch] = useState("");
    const [inlineInputs, setInlineInputs] = useState<Record<string, boolean>>({});

    const [isOtrosMenuOpen, setIsOtrosMenuOpen] = useState(false);

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

    const handleSelectCustomer = (customer: CustomerEntity | null) => {
        setSelectedCustomerInternal(customer);
        if (customer && docTypeState !== 'PR') {
            if (customer.identityDocType === '6') setDocTypeState('01');
            else setDocTypeState('03');
        }
        if (!customer) {
            setExtras(prev => ({ ...prev, placa: "", vehicleId: "" }));
        }
    };

    const handleSetDocType = (type: DocType) => {
        if (selectedCustomerInternal && type !== 'PR') {
            if (type === '01' && selectedCustomerInternal.identityDocType !== '6') {
                setSaleError("Las facturas (01) exigen que el cliente tenga un RUC.");
                setSelectedCustomerInternal(null);
            } else if (type === '03' && selectedCustomerInternal.identityDocType === '6') {
                setSaleError("Las empresas con RUC deben recibir Factura (01), no Boleta.");
                setSelectedCustomerInternal(null);
            }
        }
        setDocTypeState(type);
    };

    useEffect(() => {
        const availableSeries = dbData.series.filter(s => s.docType === docTypeState);
        if (availableSeries.length > 0) {
            setSelectedSeries(availableSeries[0]);
        } else {
            setSelectedSeries(null);
        }
    }, [docTypeState, dbData.series]);

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
            const localCustomer = await db.customers
                .filter(c => c.identityDocNumber === cleanDoc && c.deletedAt === null)
                .first();

            if (localCustomer) {
                handleSelectCustomer(localCustomer);
                return true;
            }

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

                await db.transaction('rw', [db.customers, db.outboxEvents], async () => {
                    await db.customers.add(newCustomer);
                    await db.outboxEvents.add({
                        id: uuidv4(), deviceId: currentDeviceId, entityType: 'customer', entityId: newCustomer.id,
                        operation: 'UPSERT', payloadJson: JSON.stringify(newCustomer), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                    });
                });

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

    const removeItem = (tempId: string) => setCart(cart.filter(item => item.tempId !== tempId));

    const updateQuantity = (tempId: string, qty: number) => {
        setCart(cart.map(item => item.tempId === tempId ? { ...item, cantidad: Math.max(1, qty) } : item));
    };

    const updateItemDetails = (tempId: string, newName: string, newPrice: number) => {
        setCart(cart.map(item =>
            item.tempId === tempId
                ? { ...item, name: newName, price: newPrice }
                : item
        ));
    };

    const totals = useMemo(() => {
        let rawTotal = 0;

        cart.forEach(item => {
            rawTotal += (item.price * item.cantidad);
        });

        const discountMultiplier = 1 - (globalDiscount / 100);
        const finalTotal = rawTotal * discountMultiplier;

        const finalSubtotal = finalTotal / 1.18;
        const finalIgv = finalTotal - finalSubtotal;

        return { subtotal: finalSubtotal, igv: finalIgv, total: finalTotal };
    }, [cart, globalDiscount]);

    const handleExtraChange = (key: string, value: string) => setExtras(prev => ({ ...prev, [key]: value }));
    const toggleInlineInput = (key: string) => setInlineInputs(prev => ({ ...prev, [key]: true }));
    const blurInlineInput = (key: string) => setInlineInputs(prev => ({ ...prev, [key]: false }));

    const resetForm = () => {
        handleSelectCustomer(null);
        setCart([]);
        setExtras(initialExtras);
        setGlobalDiscount(0);
        setIssueDate(today.toISOString().split("T")[0]);
        setProductSearch("");
        setInlineInputs({});
        setIsOtrosMenuOpen(false);
    };

    const processSale = async () => {
        // 3. Validación estricta: No permite facturar si no hay una sucursal en el estado global
        if (!currentDeviceId || !currentCompanyId || !activeBranchId) {
            setSaleError("Error de seguridad: No se ha detectado una sucursal activa en la sesión.");
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
            setSaleError("No tienes una serie de facturación configurada para este documento en esta sucursal.");
            return null;
        }

        const now = new Date().toISOString();
        const finalIssueDate = `${issueDate}T${now.split('T')[1]}`;
        const saleId = uuidv4();
        const finalCustomerId = selectedCustomerInternal?.id || 'CLIENTE_GENERICO_ID';

        let finalVehicleId = extras.vehicleId || null;

        let finalNotes = extras.observaciones || "";
        if (extras.ordenCompra) finalNotes += ` | O/C: ${extras.ordenCompra}`;
        if (extras.guiaRemision) finalNotes += ` | Guía: ${extras.guiaRemision}`;
        if (extras.condicionPago) finalNotes += ` | Condición: ${extras.condicionPago}`;
        finalNotes = finalNotes.startsWith(" | ") ? finalNotes.substring(3) : finalNotes;

        try {
            await db.transaction('rw', [db.sales, db.saleDetails, db.documentSeries, db.vehicles, db.outboxEvents], async () => {

                if (extras.placa && selectedCustomerInternal) {
                    const cleanPlate = extras.placa.trim().toUpperCase();
                    const existingVehicle = await db.vehicles.filter(v => v.licensePlate === cleanPlate).first();

                    if (existingVehicle) {
                        finalVehicleId = existingVehicle.id;
                        if (extras.kilometrajeActual && Number(extras.kilometrajeActual) > (existingVehicle.mileage || 0)) {
                            await db.vehicles.update(existingVehicle.id, {
                                mileage: Number(extras.kilometrajeActual), updatedAt: now, version: existingVehicle.version + 1
                            });
                        }
                    } else {
                        finalVehicleId = uuidv4();
                        const newVehicle: VehicleEntity = {
                            id: finalVehicleId,
                            customerId: selectedCustomerInternal.id,
                            licensePlate: cleanPlate,
                            brand: "SIN ESPECIFICAR",
                            model: "SIN ESPECIFICAR",
                            year: null,
                            mileage: extras.kilometrajeActual ? Number(extras.kilometrajeActual) : null,
                            notes: "Auto-generado desde Punto de Venta",
                            createdAt: now,
                            updatedAt: now,
                            deletedAt: null,
                            version: 1
                        };
                        await db.vehicles.add(newVehicle);
                        await db.outboxEvents.add({
                            id: uuidv4(), deviceId: currentDeviceId, entityType: 'vehicle', entityId: newVehicle.id,
                            operation: 'UPSERT', payloadJson: JSON.stringify(newVehicle), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                        });
                    }
                }

                const saleToSave: SaleEntity = {
                    id: saleId,
                    companyId: currentCompanyId,
                    branchId: activeBranchId,
                    customerId: finalCustomerId,
                    vehicleId: finalVehicleId,
                    docType: docTypeState,
                    series: selectedSeries?.series || 'P001',
                    correlativeNumber: selectedSeries ? selectedSeries.nextCorrelative : Date.now(),
                    issueDate: finalIssueDate,
                    currency: 'PEN',
                    subtotalAmount: Number(totals.subtotal.toFixed(2)),
                    igvAmount: Number(totals.igv.toFixed(2)),
                    totalAmount: Number(totals.total.toFixed(2)),
                    currentMileage: extras.kilometrajeActual ? Number(extras.kilometrajeActual) : null,
                    nextMaintenanceMileage: extras.proximoCambioKm ? Number(extras.proximoCambioKm) : null,
                    notes: finalNotes || null,
                    status: docTypeState === 'PR' ? 'DRAFT' : 'CONFIRMED',
                    sunatStatus: 'NOT_SENT',
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: null,
                    version: 1
                };

                await db.sales.add(saleToSave);
                await db.outboxEvents.add({
                    id: uuidv4(), deviceId: currentDeviceId, entityType: 'sale', entityId: saleId,
                    operation: 'UPSERT', payloadJson: JSON.stringify(saleToSave), clientUpdatedAt: now, entityVersion: 1, status: 'PENDING', createdAt: now
                });

                const saleDetailsToSave = cart.map(item => {
                    const lineTotal = item.price * item.cantidad * (1 - (globalDiscount / 100));
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
                series: selectedSeries?.series || 'P001',
                correlativeNumber: selectedSeries ? selectedSeries.nextCorrelative : 0,
                customerName: selectedCustomerInternal ? selectedCustomerInternal.name : 'Público en General',
                customerDocument: selectedCustomerInternal ? selectedCustomerInternal.identityDocNumber : 'S/N',
                totalAmount: totals.total,
                issueDate: finalIssueDate,
                sunatStatus: 'NOT_SENT'
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
        updateItemDetails,
        processSale,
        saleError,
        setSaleError,
        isSearchingApi,
        handleSearchApiCustomer,
        issueDate,
        setIssueDate,
        minDate,
        maxDate,
        globalDiscount,
        setGlobalDiscount,
        resetForm,
        isOtrosMenuOpen,
        setIsOtrosMenuOpen
    };
};