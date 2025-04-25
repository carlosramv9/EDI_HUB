'use client'

import { IOrder } from "@/interfaces/orders/IOrder";
import ordersApi from "@/services/api/orders/orders";
import { createContext, useContext, useMemo, useState } from "react";
import { FieldErrors, Control, FieldValues, UseFormHandleSubmit, useForm } from "react-hook-form";
import { UseFormRegister } from "react-hook-form";

interface OrdersProviderProps {
    children: React.ReactNode;
}

interface OrdersProps {
    orders: IOrder[];
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    errors: FieldErrors<FieldValues>;
    handleSubmit: UseFormHandleSubmit<FieldValues>;
    getOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersProps>({
    orders: [],
    getOrders: () => Promise.resolve(),
    register: {} as UseFormRegister<FieldValues>,
    control: {} as Control<FieldValues>,
    errors: {} as FieldErrors<FieldValues>,
    handleSubmit: {} as UseFormHandleSubmit<FieldValues>,
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

    const { register, control, formState: { errors }, handleSubmit } = useForm<IOrder>({
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

    const getOrders = async () => {
        console.log('getOrders')
        const orders = await ordersApi.getAll({ endpoint: 'all' });
        setOrders(orders.data);
    }

    const options = useMemo(() => ({
        register,
        control,
        errors,
        handleSubmit,
        orders,
        setOrders,
        getOrders,
    }), [register, control, errors, handleSubmit, orders, setOrders, getOrders])

    return <OrdersContext.Provider value={options}>
        {children}
    </OrdersContext.Provider>;
}

export default OrdersProvider;