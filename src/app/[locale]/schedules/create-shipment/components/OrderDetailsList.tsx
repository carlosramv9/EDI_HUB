'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { IOrder } from '@/interfaces/orders/IOrder'
import { useTranslations } from 'next-intl'
import OrderDetailItem from './OrderDetailItem'

interface OrderDetailsListProps {
    formData: IAsnHeader
    selectedOrders: IOrder[]
    errors: Record<string, string>
    viewMode: 'compact' | 'full'
    expandedOrders: Set<number>
    onDetailChange: (index: number, field: keyof IAdvanceShippingNotice, value: any) => void
    onToggleOrderExpansion: (index: number) => void
    onExpandAll: () => void
    onCollapseAll: () => void
    onViewModeChange: (mode: 'compact' | 'full') => void
}

const OrderDetailsList = ({
    formData,
    selectedOrders,
    errors,
    viewMode,
    expandedOrders,
    onDetailChange,
    onToggleOrderExpansion,
    onExpandAll,
    onCollapseAll,
    onViewModeChange
}: OrderDetailsListProps) => {
    const t = useTranslations()

    return (
        <div className="rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('orderDetails') || 'Detalles de las Órdenes'} ({selectedOrders.length})
                </h3>
                {viewMode === 'compact' && (
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onExpandAll}
                            className="text-xs"
                        >
                            {t('expandAll') || 'Expandir Todo'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCollapseAll}
                            className="text-xs"
                        >
                            {t('collapseAll') || 'Colapsar Todo'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onViewModeChange('full')}
                            className="text-xs"
                        >
                            {t('fullView') || 'Vista Completa'}
                        </Button>
                    </div>
                )}
                {viewMode === 'full' && selectedOrders.length > 5 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onViewModeChange('compact')}
                        className="text-xs"
                    >
                        {t('compactView') || 'Vista Compacta'}
                    </Button>
                )}
            </div>
            <div className="space-y-2">
                {formData.details?.map((detail, index) => {
                    const order = selectedOrders[index]
                    const isExpanded = viewMode === 'full' || expandedOrders.has(index)
                    
                    return (
                        <OrderDetailItem
                            key={index}
                            detail={detail}
                            order={order}
                            index={index}
                            isExpanded={isExpanded}
                            viewMode={viewMode}
                            errors={errors}
                            onFieldChange={(field, value) => onDetailChange(index, field, value)}
                            onToggleExpand={() => onToggleOrderExpansion(index)}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default OrderDetailsList

