import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import SchedulesTable from './components/SchedulesTable'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ScheduleProvider from '@/providers/schedules/ScheduleProvider'
import UploadFilesProvider from '@/providers/common/UploadFilesProvider'
import TableProvider from '@/providers/TableProvider'

const SchedulesView = () => {
    return (
        <MainLayout>
            <TableProvider>
                <ScheduleProvider>
                    <OrdersProvider>
                        <UploadFilesProvider>
                            <div className='md:px-24 xl:px-12'>
                                <Breadcrumb />
                                <SchedulesTable />
                            </div>
                        </UploadFilesProvider>
                    </OrdersProvider>
                </ScheduleProvider>
            </TableProvider>
        </MainLayout>
    )
}

export default SchedulesView