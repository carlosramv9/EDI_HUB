'use client'

import { useAppDispatch } from "@/app/store";
import { IOrder } from "@/interfaces/orders/IOrder";
import { SearchModel, SMOrders } from "@/interfaces/searchModel/SearchModels";
import { BaseServiceResponse, BaseServiceResponseArray } from "@/services/api/BaseService";
import ordersApi from "@/services/api/orders/orders";
import { getOrders, getOrdersFailure, getOrdersSuccess, getOrderSuccess } from "@/store/features/orders/orderSlice";
import dayjs from "dayjs";
import React, { createContext, useContext, useMemo, useState } from "react";
import { FieldErrors, Control, FieldValues, UseFormHandleSubmit, useForm, UseFormSetValue } from "react-hook-form";
import { UseFormRegister } from "react-hook-form";
import { toast } from "react-toastify";

interface OrdersProviderProps {
    children: React.ReactNode;
}

interface OrdersProps<T> {
    orders: IOrder[];
    files: File[];
    setFiles: (files: File[]) => void;
    register: UseFormRegister<IOrder>;
    setValue: UseFormSetValue<IOrder>;
    control: Control<IOrder>;
    errors: FieldErrors<IOrder>;
    searchModel: SMOrders | undefined;
    setSearchModel: (searchModel: SMOrders | undefined) => void;
    handleSubmit: UseFormHandleSubmit<IOrder>;
    getOrdersList: (sm?: SMOrders) => Promise<void>;
    getOrderById: (id: string) => Promise<void>;
    createOrder: (order: IOrder) => Promise<void>;
    updateOrder: (order: IOrder) => Promise<void>;
    downloadASNFile: () => Promise<void>;
    openMenuId: number | null;
    setOpenMenuId: (id: number | null) => void;
    uploadFiles: (files: File[]) => Promise<void>;
    cancelOrder: (id: number) => Promise<void>;
}

const OrdersContext = createContext<OrdersProps<IOrder>>({
    orders: [],
    getOrdersList: () => Promise.resolve(),
    getOrderById: () => Promise.resolve(),
    createOrder: () => Promise.resolve(),
    updateOrder: () => Promise.resolve(),
    downloadASNFile: () => Promise.resolve(),
    register: {} as UseFormRegister<IOrder>,
    setValue: {} as UseFormSetValue<IOrder>,
    control: {} as Control<IOrder>,
    errors: {} as FieldErrors<IOrder>,
    searchModel: {} as SMOrders,
    setSearchModel: () => { },
    files: [] as File[],
    setFiles: () => { },
    handleSubmit: {} as UseFormHandleSubmit<IOrder>,
    openMenuId: null,
    setOpenMenuId: () => { },
    uploadFiles: (files: File[]) => Promise.resolve(),
    cancelOrder: (id: number) => Promise.resolve()
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
    const [files, setFiles] = useState<File[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const dispatch = useAppDispatch();
    const [searchModel, setSearchModel] = useState<SMOrders>();

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

    const getOrdersList = async (sm?: SMOrders) => {
        dispatch(getOrders());
        try {
            const orders = await ordersApi.post<BaseServiceResponseArray<IOrder>>({ endpoint: 'list', data: { ...searchModel, ...sm } as SMOrders });
            dispatch(getOrdersSuccess({ data: orders.data, total: orders.total }));
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

    const uploadFiles = async (files: File[]) => {
        dispatch(getOrders());
        try {
            await ordersApi.UploadSchedules(files);

            const orders = await ordersApi.post<BaseServiceResponseArray<IOrder>>({ endpoint: 'list', data: searchModel });
            dispatch(getOrdersSuccess({ data: orders.data, total: orders.total }));

            toast.success('Schedules uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload schedules');
        }
    }

    const downloadASNFile = async () => {
        try {
            const response = await ordersApi.downloadASN();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ASN_${dayjs().format('YYMMDDHHmmss')}.edi`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            toast.error('Failed to download ASN file');
        }
    }

    const cancelOrder = async (id: number) => {
        dispatch(getOrders());
        try {
            await ordersApi.delete({ id, endpoint: 'cancel' });
            const orders = await ordersApi.post<BaseServiceResponseArray<IOrder>>({ endpoint: 'list', data: searchModel });
            dispatch(getOrdersSuccess({ data: orders.data, total: orders.total }));
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
        downloadASNFile,
        orders,
        setOrders,
        getOrdersList,
        getOrderById,
        createOrder,
        updateOrder,
        openMenuId,
        setOpenMenuId,
        searchModel,
        setSearchModel,
        files,
        setFiles,
        uploadFiles,
        cancelOrder
    }), [register, control, errors, handleSubmit, orders, setOrders, getOrdersList, getOrderById, createOrder, updateOrder, searchModel, setSearchModel, files, setFiles, uploadFiles, cancelOrder])

    return <OrdersContext.Provider value={options}>
        {children}
    </OrdersContext.Provider>;
}

export default OrdersProvider;