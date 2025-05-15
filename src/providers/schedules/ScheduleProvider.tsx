'use client'
import { useAppDispatch } from '@/app/store';
import ordersApi from '@/services/api/orders/orders';
import { getOrdersSuccess } from '@/store/features/orders/orderSlice';
import React, { useMemo } from 'react'
import { useOrders } from '../orders/OrdersProvider';
import { toast } from 'react-toastify';

interface ScheduleContextProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleContext = React.createContext<ScheduleContextProps>({
    showModal: false,
    setShowModal: () => { }
});

const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
    const [showModal, setShowModal] = React.useState(false);

    const value = useMemo(() => ({
        showModal,
        setShowModal,
    }), [showModal]);

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useScheduleContext = () => {
    const context = React.useContext(ScheduleContext);
    if (!context) {
        throw new Error('useScheduleContext must be used within a ScheduleProvider');
    }
    return context;
};

export default ScheduleProvider;
