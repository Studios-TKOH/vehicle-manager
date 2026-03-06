import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db, type CustomerEntity, type ProductEntity, type DocumentSeriesEntity, type SaleEntity } from '@data/LocalDB';
import { useAuth } from '@hooks/useAuth';

export type DocType = '01' | '03' | 'PR';

export interface CartItem extends ProductEntity {
    tempId: string;
    cantidad: number;
    notaItem?: string;
}

export const useSales = () => {
    const location = useLocation();
    const { deviceId } = useAuth();
    const currentDeviceId = deviceId || localStorage.getItem('deviceId');

    const prefill = location.state?.prefillData;

    const [saleError, setSaleError] = useState<string | null>(null);

    const dbData = useLiveQuery(async () => {
        const customers = await db.customers.filter(c => c.deletedAt === null).toArray();
        const products = await db.products.filter(p => p.deletedAt === null && p.isActive).toArray();
        const series = await db.documentSeries.filter(s => s.deletedAt === null && s.active).toArray();
        return { customers, products, series };
    }, []) || { customers: [], products: [], series: [] };

    const [docType, setDocType] = useState<DocType>(prefill?.docType || '03');
    const [selectedSeries, setSelectedSeries] = useState<DocumentSeriesEntity | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerEntity | null>(null);

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
            if (prefill.customerId && !selectedCustomer) {
                const customer = dbData.customers.find(c => c.id === prefill.customerId);
                if (customer) setSelectedCustomer(customer);
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

    // Reglas de Negocio SUNAT: Cambio de Tipo de Documento
    useEffect(() => {
        const availableSeries = dbData.series.filter(s => s.docType === docType);
        if (availableSeries.length > 0) {
            setSelectedSeries(availableSeries[0]);
        } else {
            setSelectedSeries(null);
        }

        if (selectedCustomer) {
            if (docType === '01' && selectedCustomer.identityDocType !== '6') {
                setSelectedCustomer(null);
                setSaleError("Las facturas (01) requieren que el cliente tenga un RUC registrado.");
            } else if (docType === '03' && selectedCustomer.identityDocType === '6') {
                setSelectedCustomer(null);
                setSaleError("Las empresas con RUC deben requerir Factura (01), no Boleta.");
            }
        }
    }, [docType, dbData.series]);

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
        // Validación con Modales
        if (!currentDeviceId) {
            setSaleError("Error de seguridad: Sesión de dispositivo no válida.");
            return null;
        }
        if (!selectedCustomer && docType !== 'PR') {
            setSaleError("Para emitir un comprobante válido para SUNAT, debes seleccionar un cliente.");
            return null;
        }
        if (cart.length === 0) {
            setSaleError("El carrito está vacío. Añade al menos un producto para facturar.");
            return null;
        }
        if (docType !== 'PR' && !selectedSeries) {
            setSaleError("No tienes una serie de facturación configurada para este tipo de documento en esta sucursal.");
            return null;
        }

        const now = new Date().toISOString();
        const saleId = uuidv4();

        const finalCustomerId = selectedCustomer?.id || 'CLIENTE_GENERICO_ID';

        const saleToSave: SaleEntity = {
            id: saleId,
            companyId: cart[0]?.companyId || 'DEFAULT_COMPANY',
            branchId: selectedSeries?.branchId || 'DEFAULT_BRANCH',
            customerId: finalCustomerId,
            vehicleId: extras.vehicleId || null,
            docType: docType,
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
            status: docType === 'PR' ? 'DRAFT' : 'CONFIRMED',
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

                if (selectedSeries && docType !== 'PR') {
                    const updatedSeries = { ...selectedSeries, nextCorrelative: selectedSeries.nextCorrelative + 1, updatedAt: now };
                    await db.documentSeries.put(updatedSeries);
                }
            });

            return {
                docType: docType,
                series: saleToSave.series,
                correlativeNumber: saleToSave.correlativeNumber,
                customerName: selectedCustomer ? selectedCustomer.name : 'Público en General',
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
        docType,
        setDocType,
        selectedSeries,
        selectedCustomer,
        setSelectedCustomer,
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
        setSaleError
    };
};