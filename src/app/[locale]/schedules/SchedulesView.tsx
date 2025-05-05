import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import SchedulesTable from './components/SchedulesTable'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import Breadcrumb from '@/components/shared/Breadcrumb'

const SchedulesView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <Breadcrumb />
                <SchedulesTable />
            </OrdersProvider>
        </MainLayout>
    )
}

export default SchedulesView