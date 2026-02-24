import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Sale {
    id: string;
    clienteId: string;
    montoTotal: number;
    sync_status: 'PENDING' | 'SYNCED';
}

interface SalesState {
    items: Sale[];
}

const initialState: SalesState = {
    items: [],
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        addSaleRequest: (state, action: PayloadAction<Omit<Sale, 'sync_status'>>) => {
            state.items.push({ ...action.payload, sync_status: 'PENDING' });
        },
        updateSaleStatus: (state, action: PayloadAction<{ id: string; status: 'SYNCED' | 'PENDING' }>) => {
            const sale = state.items.find(item => item.id === action.payload.id);
            if (sale) {
                sale.sync_status = action.payload.status;
            }
        },
        addSaleSuccess: (state, action: PayloadAction<string>) => {
            const sale = state.items.find(item => item.id === action.payload);
            if (sale) sale.sync_status = 'SYNCED';
        },
    },
});

export const { addSaleRequest, addSaleSuccess, updateSaleStatus } = salesSlice.actions;
export default salesSlice.reducer;