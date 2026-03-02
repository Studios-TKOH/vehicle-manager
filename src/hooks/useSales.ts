import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '@data/db'; //

export const useSales = () => {
    const location = useLocation();
    const prefill = location.state?.prefillData;

    const [documento, setDocumento] = useState({
        tipo: 'FACTURA',
        serie: db.documentSeries[0].serie,
        correlativo: String(db.documentSeries[0].correlativoActual + 1).padStart(6, '0'),
        fecha: new Date().toISOString().split('T')[0],
        cliente: db.customers.find(c => c.id === prefill?.customerId) || null,
    });

    // 1. Agregamos el Kilometraje a los "Extras" (Botones superiores)
    const [extras, setExtras] = useState({
        placa: prefill?.placa || "",
        ordenCompra: "",
        observaciones: prefill?.observacionSugerida || "",
        condicionPago: "CONTADO",
        metodoPago: "EFECTIVO",
        kilometrajeActual: prefill?.kilometrajeActual || "",
        proximoCambioKm: prefill?.kmProximo || ""
    });

    const [inlineInputs, setInlineInputs] = useState<Record<string, boolean>>({});

    // 2. Inicializamos el carrito DIRECTAMENTE si vienen productos a repetir
    const [cart, setCart] = useState<any[]>(() => {
        if (prefill?.cartItems && prefill.cartItems.length > 0) {
            return prefill.cartItems.map((item: any) => ({
                ...item,
                tempId: crypto.randomUUID()
            }));
        }
        return [];
    });

    const [productSearch, setProductSearch] = useState("");

    const addItem = (product: any) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
            ));
        } else {
            setCart([...cart, {
                ...product,
                tempId: crypto.randomUUID(),
                cantidad: 1,
                precioUnitario: product.precioVenta
            }]);
        }
        setProductSearch("");
    };

    const removeItem = (tempId: string) => {
        setCart(cart.filter(item => item.tempId !== tempId));
    };

    const updateQuantity = (tempId: string, qty: number) => {
        setCart(cart.map(item =>
            item.tempId === tempId ? { ...item, cantidad: Math.max(1, qty) } : item
        ));
    };

    const totals = useMemo(() => {
        const total = cart.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
        const subtotal = total / 1.18;
        const igv = total - subtotal;
        return { subtotal, igv, total };
    }, [cart]);

    const toggleInlineInput = (key: string) => {
        setInlineInputs(prev => ({ ...prev, [key]: true }));
    };

    const blurInlineInput = (key: string) => {
        setInlineInputs(prev => ({ ...prev, [key]: false }));
    };

    const handleExtraChange = (key: string, value: string) => {
        setExtras(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        if (prefill?.productosUsuales && cart.length === 0) {
            console.log("Sugerencia de productos usuales:", prefill.productosUsuales);
        }
    }, [prefill, cart.length]);

    return {
        documento,
        setDocumento,
        extras,
        handleExtraChange,
        inlineInputs,
        toggleInlineInput,
        blurInlineInput,
        cart,
        addItem,
        removeItem,
        updateQuantity,
        productSearch,
        setProductSearch,
        totals,
        productosUsuales: prefill?.productosUsuales || []
    };
};