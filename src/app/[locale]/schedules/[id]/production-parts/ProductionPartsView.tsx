'use client'

import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import OrdersProvider from '@/providers/orders/OrdersProvider'
import ProductionPartProvider from '@/providers/production-parts/ProductionPartProvider'
import ProductionPartForm from '../../../../../components/forms/ProductionPartForm'

const inputClasses = "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm"
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const ProductionPartsView = () => {
    return (
        <MainLayout>
            <OrdersProvider>
                <ProductionPartProvider>
                    <ProductionPartForm />
                </ProductionPartProvider>
            </OrdersProvider>
        </MainLayout>
    )
}

export default ProductionPartsView