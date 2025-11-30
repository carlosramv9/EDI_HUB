'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { IOrder } from '@/interfaces/orders/IOrder'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'

interface OrderDetailItemProps {
    detail: IAdvanceShippingNotice
    order: IOrder
    index: number
    isExpanded: boolean
    viewMode: 'compact' | 'full'
    errors: Record<string, string>
    onFieldChange: (field: keyof IAdvanceShippingNotice, value: any) => void
    onToggleExpand?: () => void
}

const OrderDetailItem = ({
    detail,
    order,
    index,
    isExpanded,
    viewMode,
    errors,
    onFieldChange,
    onToggleExpand
}: OrderDetailItemProps) => {
    const t = useTranslations()
    const hasErrors = errors[`detail_${index}_partNumber`] || errors[`detail_${index}_quantity`]

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header colapsable */}
            <div 
                className={`flex items-center justify-between p-3 ${viewMode === 'compact' ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : 'border-b border-gray-200 dark:border-gray-700'}`}
                onClick={viewMode === 'compact' ? onToggleExpand : undefined}
            >
                <div className="flex items-center gap-3 flex-1">
                    {viewMode === 'compact' && (
                        <svg 
                            className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {t('order') || 'Orden'} #{index + 1}: {order?.orderNumber || 'N/A'}
                        </h4>
                        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{t('partNumber') || 'Parte'}: {detail.partNumber || 'N/A'}</span>
                            <span>{t('quantity') || 'Cantidad'}: {detail.quantity || 0}</span>
                            {order?.partName && <span>{order.partName}</span>}
                        </div>
                    </div>
                </div>
                {viewMode === 'compact' && (
                    <div className="flex items-center gap-2">
                        {hasErrors ? (
                            <span className="text-red-500 text-xs">⚠️ {t('hasErrors') || 'Tiene errores'}</span>
                        ) : (
                            <span className="text-green-500 text-xs">✓</span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Contenido expandible */}
            {isExpanded && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2" data-error-field={`detail_${index}_partNumber`}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('partNumber') || 'Número de Parte'} <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={detail.partNumber || ''}
                                onChange={(e) => onFieldChange('partNumber', e.target.value)}
                                placeholder={t('partNumberPlaceholder') || 'Número de parte'}
                                className={errors[`detail_${index}_partNumber`] ? 'border-red-500' : ''}
                            />
                            {errors[`detail_${index}_partNumber`] && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                    <span>⚠️</span>
                                    <span>{errors[`detail_${index}_partNumber`]}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2" data-error-field={`detail_${index}_quantity`}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('quantity') || 'Cantidad'} <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                value={detail.quantity || 0}
                                onChange={(e) => onFieldChange('quantity', parseInt(e.target.value) || 0)}
                                placeholder={t('quantityPlaceholder') || 'Cantidad'}
                                className={errors[`detail_${index}_quantity`] ? 'border-red-500' : ''}
                            />
                            {errors[`detail_${index}_quantity`] && (
                                <p className="text-red-500 text-xs flex items-center gap-1">
                                    <span>⚠️</span>
                                    <span>{errors[`detail_${index}_quantity`]}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('devOrderNumber') || 'Número de Orden de Desarrollo'}
                            </label>
                            <Input
                                value={detail.devOrderNumber || ''}
                                onChange={(e) => onFieldChange('devOrderNumber', e.target.value)}
                                placeholder={t('devOrderNumberPlaceholder') || 'Número de orden'}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('engChange') || 'Cambio de Ingeniería'}
                            </label>
                            <Input
                                value={detail.engChange || ''}
                                onChange={(e) => onFieldChange('engChange', e.target.value)}
                                placeholder={t('engChangePlaceholder') || 'Cambio de ingeniería'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderDetailItem

