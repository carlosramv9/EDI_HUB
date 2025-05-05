'use client'

import { useAppDispatch } from "@/app/store";
import { IOrder } from "@/interfaces/orders/IOrder";
import { SearchModel } from "@/interfaces/searchModel/SearchModels";
import { BaseServiceResponse, BaseServiceResponseArray } from "@/services/api/BaseService";
import ordersApi from "@/services/api/orders/orders";
import { getOrders, getOrdersFailure, getOrdersSuccess, getOrderSuccess } from "@/store/features/orders/orderSlice";
import { createContext, useContext, useMemo, useState } from "react";
import { FieldErrors, Control, FieldValues, UseFormHandleSubmit, useForm, UseFormSetValue } from "react-hook-form";
import { UseFormRegister } from "react-hook-form";

interface OrdersProviderProps {
    children: React.ReactNode;
}

interface OrdersProps<T> {
    orders: IOrder[];
    register: UseFormRegister<IOrder>;
    setValue: UseFormSetValue<IOrder>;
    control: Control<IOrder>;
    errors: FieldErrors<IOrder>;
    searchModel: SearchModel;
    setSearchModel: (searchModel: SearchModel) => void;
    handleSubmit: UseFormHandleSubmit<IOrder>;
    getOrdersList: () => Promise<void>;
    getOrderById: (id: string) => Promise<void>;
    createOrder: (order: IOrder) => Promise<void>;
    updateOrder: (order: IOrder) => Promise<void>;
}

const OrdersContext = createContext<OrdersProps<IOrder>>({
    orders: [],
    getOrdersList: () => Promise.resolve(),
    getOrderById: () => Promise.resolve(),
    createOrder: () => Promise.resolve(),
    updateOrder: () => Promise.resolve(),
    register: {} as UseFormRegister<IOrder>,
    setValue: {} as UseFormSetValue<IOrder>,
    control: {} as Control<IOrder>,
    errors: {} as FieldErrors<IOrder>,
    searchModel: {} as SearchModel,
    setSearchModel: () => { },
    handleSubmit: {} as UseFormHandleSubmit<IOrder>,
});

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
};

const OrdersProvider = ({ children }: OrdersProviderProps) => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const dispatch = useAppDispatch();
    const [searchModel, setSearchModel] = useState<SearchModel>({
        id: '',
        orderColumn: 'id',
        orderDirection: 'desc',
        page: 1,
        pageSize: 10,
    });

    const { register, control, formState: { errors }, handleSubmit, setValue } = useForm<IOrder>({
        defaultValues: {
            type: '',
            orderNumber: '',
            partNumber: '',
            partName: '',
            shipDate: '',
            shipTime: '',
            quantity: 0,
            quantityRack: 0,
            shipTo: '',
            asnNumber: '',
            orderCode: '',
        }
    });

    const getOrdersList = async () => {
        dispatch(getOrders());
        try {
            const orders = await ordersApi.getAll({ endpoint: 'all' });
            dispatch(getOrdersSuccess({ data: orders.data, total: orders.pageSize }));
        } catch (error) {
            dispatch(getOrdersFailure(error));
            throw error;
        }
    }

    const getOrderById = async (id: string) => {
        dispatch(getOrders());
        try {
            const order = await ordersApi.getById({ id });
            dispatch(getOrderSuccess(order));
        } catch (error) {
            dispatch(getOrdersFailure(error));
            throw error;
        }
    }

    const createOrder = async (order: IOrder) => {
        dispatch(getOrders());
        try {
            await ordersApi.post({ data: order });
            const orderCreated = await ordersApi.post<BaseServiceResponseArray<IOrder>>({ endpoint: 'list', data: searchModel });
            dispatch(getOrdersSuccess({ data: orderCreated?.data as IOrder[], total: orderCreated?.pageSize as number }));
        } catch (error) {
            dispatch(getOrdersFailure(error));
            throw error;
        }
    }

    const updateOrder = async (order: IOrder) => {
        dispatch(getOrders());
        try {
            console.log(order)
            await ordersApi.update({ data: order });
            const orderUpdated = await ordersApi.post<BaseServiceResponseArray<IOrder>>({ endpoint: 'list', data: searchModel });
            dispatch(getOrdersSuccess({ data: orderUpdated?.data as IOrder[], total: orderUpdated?.pageSize as number }));
        } catch (error) {
            dispatch(getOrdersFailure(error));
        }
    }

    const options = useMemo(() => ({
        register,
        setValue,
        control,
        errors,
        handleSubmit,
        orders,
        setOrders,
        getOrdersList,
        getOrderById,
        createOrder,
        updateOrder,
        searchModel,
        setSearchModel
    }), [register, control, errors, handleSubmit, orders, setOrders, getOrdersList, getOrderById, createOrder, updateOrder, searchModel, setSearchModel])

    return <OrdersContext.Provider value={options}>
        {children}
    </OrdersContext.Provider>;
}

export default OrdersProvider;