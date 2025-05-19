import React from 'react'
import ASNForm from '../../../../../components/ASNForm'
import MainLayout from '@/components/layouts/MainLayout'
import Breadcrumb from '@/components/shared/Breadcrumb'
import UploadFilesProvider from '@/providers/common/UploadFilesProvider'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import ScheduleProvider from '@/providers/schedules/ScheduleProvider'
import ASNProvider from '@/providers/asn/ASNProvider'

const GenerateASN = () => {
    return (
        <MainLayout>
            <ScheduleProvider>
                <OrdersProvider>
                    <ASNProvider>
                        <ASNForm />
                    </ASNProvider>
                </OrdersProvider>
            </ScheduleProvider>
        </MainLayout>
    )
}

export default GenerateASN