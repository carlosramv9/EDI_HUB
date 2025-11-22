import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IOrder } from '@/interfaces/orders/IOrder'

export interface SelectedOrdersState {
    selectedOrders: IOrder[];
    selectionMode: boolean;
}

const initialState: SelectedOrdersState = {
    selectedOrders: [],
    selectionMode: false,
}

export const selectedOrdersSlice = createSlice({
    name: 'selectedOrders',
    initialState,
    reducers: {
        toggleSelectionMode: (state) => {
            state.selectionMode = !state.selectionMode;
            // Si se desactiva el modo, limpiar las selecciones
            if (!state.selectionMode) {
                state.selectedOrders = [];
            }
        },
        setSelectionMode: (state, action: PayloadAction<boolean>) => {
            state.selectionMode = action.payload;
            // Si se desactiva el modo, limpiar las selecciones
            if (!action.payload) {
                state.selectedOrders = [];
            }
        },
        toggleOrderSelection: (state, action: PayloadAction<IOrder>) => {
            const index = state.selectedOrders.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                // Si ya está seleccionada, removerla
                state.selectedOrders.splice(index, 1);
            } else {
                // Si no está seleccionada, agregarla
                state.selectedOrders.push(action.payload);
            }
        },
        selectOrder: (state, action: PayloadAction<IOrder>) => {
            const exists = state.selectedOrders.some(order => order.id === action.payload.id);
            if (!exists) {
                state.selectedOrders.push(action.payload);
            }
        },
        deselectOrder: (state, action: PayloadAction<number>) => {
            state.selectedOrders = state.selectedOrders.filter(order => order.id !== action.payload);
        },
        selectAllOrders: (state, action: PayloadAction<IOrder[]>) => {
            state.selectedOrders = action.payload;
        },
        clearSelectedOrders: (state) => {
            state.selectedOrders = [];
        }
    },
})

export const { 
    toggleSelectionMode,
    setSelectionMode,
    toggleOrderSelection,
    selectOrder,
    deselectOrder,
    selectAllOrders,
    clearSelectedOrders
} = selectedOrdersSlice.actions

export default selectedOrdersSlice.reducer

