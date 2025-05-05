import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import PalletMasterForm from './components/PalletMasterForm'
import OrdersProvider from '@/providers/orders/OrdersProvider'

const PalletMasterView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <PalletMasterForm />
            </OrdersProvider>
        </MainLayout>
    )
}

export default PalletMasterView