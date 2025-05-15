import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import PalletMasterForm from './components/PalletMasterForm'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import PalletMasterProvider from '@/providers/pallet-master/PalletMasterProvider'

const PalletMasterView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <PalletMasterProvider>
                    <PalletMasterForm />
                </PalletMasterProvider>
            </OrdersProvider>
        </MainLayout>
    )
}

export default PalletMasterView