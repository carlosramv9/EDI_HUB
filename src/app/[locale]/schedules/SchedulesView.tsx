import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import SchedulesTable from './components/SchedulesTable'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ScheduleProvider from '@/providers/schedules/ScheduleProvider'
import UploadFilesProvider from '@/providers/common/UploadFilesProvider'

const SchedulesView = () => {
    return (
        <MainLayout>
            <ScheduleProvider>
                <OrdersProvider>
                    <UploadFilesProvider>
                        <Breadcrumb />
                        <SchedulesTable />
                    </UploadFilesProvider>
                </OrdersProvider>
            </ScheduleProvider>
        </MainLayout>
    )
}

export default SchedulesView