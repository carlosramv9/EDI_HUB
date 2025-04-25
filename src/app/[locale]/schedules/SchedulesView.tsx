import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import SchedulesTable from './components/SchedulesTable'
import OrdersProvider from '@/providers/orders/OrdersProvider'

const SchedulesView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <SchedulesTable />
            </OrdersProvider>
        </MainLayout>
    )
}

export default SchedulesView