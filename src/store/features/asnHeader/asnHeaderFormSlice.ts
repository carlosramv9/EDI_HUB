import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { IOrder } from '@/interfaces/orders/IOrder'

export interface AsnHeaderFormState {
    asnHeader: IAsnHeader | null;
    selectedOrders: IOrder[];
    isOpen: boolean;
    loading: boolean;
}

const initialState: AsnHeaderFormState = {
    asnHeader: null,
    selectedOrders: [],
    isOpen: false,
    loading: false,
}

export const asnHeaderFormSlice = createSlice({
    name: 'asnHeaderForm',
    initialState,
    reducers: {
        setSelectedOrders: (state, action: PayloadAction<IOrder[]>) => {
            state.selectedOrders = action.payload;
        },
        setAsnHeader: (state, action: PayloadAction<IAsnHeader | null>) => {
            state.asnHeader = action.payload;
        },
        openForm: (state, action: PayloadAction<IOrder[]>) => {
            state.selectedOrders = action.payload;
            state.isOpen = true;
            // Inicializar el ASN Header con datos de las órdenes seleccionadas
            if (action.payload.length > 0) {
                const firstOrder = action.payload[0];
                state.asnHeader = {
                    shipDate: firstOrder.shipDate,
                    quantity: action.payload.reduce((sum, order) => sum + (order.quantity || 0), 0),
                    details: action.payload.map(order => ({
                        orderId: order.id,
                        partNumber: order.partNumber,
                        quantity: order.quantity,
                        devOrderNumber: order.orderNumber,
                        engChange: order.ecs,
                        shipDate: order.shipDate,
                    } as IAdvanceShippingNotice))
                };
            }
        },
        closeForm: (state) => {
            state.isOpen = false;
            state.asnHeader = null;
            state.selectedOrders = [];
        },
        updateAsnHeader: (state, action: PayloadAction<Partial<IAsnHeader>>) => {
            if (state.asnHeader) {
                state.asnHeader = { ...state.asnHeader, ...action.payload };
            }
        },
        updateDetail: (state, action: PayloadAction<{ index: number; detail: Partial<IAdvanceShippingNotice> }>) => {
            if (state.asnHeader?.details) {
                state.asnHeader.details[action.payload.index] = {
                    ...state.asnHeader.details[action.payload.index],
                    ...action.payload.detail
                };
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
})

export const { 
    setSelectedOrders,
    setAsnHeader,
    openForm,
    closeForm,
    updateAsnHeader,
    updateDetail,
    setLoading
} = asnHeaderFormSlice.actions

export default asnHeaderFormSlice.reducer

