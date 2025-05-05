import React from 'react'
import ScheduleForm from './components/ScheduleForm'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import MainLayout from '@/components/layouts/MainLayout'

const ScheduleFormView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <ScheduleForm />
            </OrdersProvider>
        </MainLayout>
    )
}

export default ScheduleFormView