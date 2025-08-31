import { SearchModel, SMOrders, SMASNProcessed } from "@/interfaces/searchModel/SearchModels";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    [key: string]: SearchModel | SMOrders | SMASNProcessed;
}

const initialState: FilterState = {
    orders: {orderColumn: 'id', orderDirection: 'desc', page: 1, pageSize: 10, active: true} as SMOrders,
    asn: {orderColumn: 'id', orderDirection: 'desc', page: 1, pageSize: 10} as SMASNProcessed,
    schedules: {orderColumn: 'id', orderDirection: 'desc', page: 1, pageSize: 10, active: true} as SMOrders
}

export const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<{ catalogName: string; data: SearchModel | SMOrders | SMASNProcessed }>) => {
            state[action.payload.catalogName] = action.payload.data;
        },
        clearFilters: (state) => {
            return initialState;
        },
        clearFilter: (state, action: PayloadAction<{ catalogName: string }>) => {
            const catalogName = action.payload.catalogName;
            if (initialState[catalogName]) {
                state[catalogName] = initialState[catalogName];
            }
        }
    },
})

export const { setFilters, clearFilters, clearFilter } = filterSlice.actions;
export default filterSlice.reducer