import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IOrder } from '@/interfaces/orders/IOrder'
import { IOption } from '@/interfaces/IOption'

export interface OrdersState {
    list: IOrder[];
    data: IOrder;
    options: IOption[];
    total: number;
    loading: boolean;
    error: any;
}

const initialState: OrdersState = {
    list: [],
    data: {} as IOrder,
    options: [],
    total: 0,
    loading: false,
    error: null,
}

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        getOrders: (state) => {
            state.loading = true;
        },
        getOrdersSuccess: (state, action: PayloadAction<{ data: IOrder[], total: number }>) => {
            state.loading = false;
            state.list = action.payload.data;
            state.total = action.payload.total;
        },
        getOrderSuccess: (state, action: PayloadAction<IOrder>) => {
            state.loading = false;
            state.data = action.payload;
        },
        getOrdersFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        getOptionsSuccess: (state, action: PayloadAction<IOption[]>) => {
            state.loading = false;
            state.options = action.payload;
        },
        clearOrder: (state) => {
            state.data = {} as IOrder;
        },
        clearOrders: (state) => {
            state.list = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { 
    getOrders,
    getOrdersSuccess,
    getOrdersFailure,
    getOrderSuccess,
    getOptionsSuccess,
    clearOrder,
    clearOrders
} = ordersSlice.actions

export default ordersSlice.reducer