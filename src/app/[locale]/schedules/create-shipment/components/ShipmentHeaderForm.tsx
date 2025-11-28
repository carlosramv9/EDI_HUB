'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'

interface ShipmentHeaderFormProps {
    formData: IAsnHeader
    errors: Record<string, string>
    onFieldChange: (field: keyof IAsnHeader, value: any) => void
}

const ShipmentHeaderForm = ({ formData, errors, onFieldChange }: ShipmentHeaderFormProps) => {
    const t = useTranslations()

    return (
        <div className="rounded-lg p-6 border border-gray-400/75 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('headerInformation') || 'Información del Envío'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2" data-error-field="scacCode">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('scacCode') || 'Código SCAC'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.scacCode || ''}
                        onChange={(e) => onFieldChange('scacCode', e.target.value)}
                        placeholder={t('scacCodePlaceholder') || 'Ingrese el código SCAC'}
                        className={errors.scacCode ? 'border-red-500' : ''}
                    />
                    {errors.scacCode && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{errors.scacCode}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-2" data-error-field="carrier">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('carrier') || 'Transportista'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.carrier || ''}
                        onChange={(e) => onFieldChange('carrier', e.target.value)}
                        placeholder={t('carrierPlaceholder') || 'Ingrese el transportista'}
                        className={errors.carrier ? 'border-red-500' : ''}
                    />
                    {errors.carrier && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{errors.carrier}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bill of Lading
                    </label>
                    <Input
                        value={formData.billOfLanding || ''}
                        onChange={(e) => onFieldChange('billOfLanding', e.target.value)}
                        placeholder="Bill of Lading"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Packing List
                    </label>
                    <Input
                        value={formData.packingList || ''}
                        onChange={(e) => onFieldChange('packingList', e.target.value)}
                        placeholder="Packing List"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Carrier's Reference Number (PRO/Invoice)
                    </label>
                    <Input
                        value={formData.carrierRef || ''}
                        onChange={(e) => onFieldChange('carrierRef', e.target.value)}
                        placeholder="Carrier's Reference Number"
                    />
                </div>

                <div className="space-y-2" data-error-field="shipDate">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('shipDate') || 'Fecha de Envío'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="date"
                        value={formData.shipDate ? dayjs(formData.shipDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => onFieldChange('shipDate', e.target.value)}
                        className={errors.shipDate ? 'border-red-500' : ''}
                    />
                    {errors.shipDate && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{errors.shipDate}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('routerNumber') || 'Número de Ruta'}
                    </label>
                    <Input
                        value={formData.routerNumber || ''}
                        onChange={(e) => onFieldChange('routerNumber', e.target.value)}
                        placeholder={t('routerNumberPlaceholder') || 'Ingrese el número de ruta'}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('authorizationNumber') || 'Número de Autorización'}
                    </label>
                    <Input
                        value={formData.authorizationNumber || ''}
                        onChange={(e) => onFieldChange('authorizationNumber', e.target.value)}
                        placeholder={t('authorizationNumberPlaceholder') || 'Ingrese el número de autorización'}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('totalQuantity') || 'Cantidad Total'}
                    </label>
                    <Input
                        type="number"
                        value={formData.quantity || 0}
                        onChange={(e) => onFieldChange('quantity', parseInt(e.target.value) || 0)}
                        readOnly
                        className="bg-gray-100 dark:bg-gray-800"
                    />
                </div>
            </div>
        </div>
    )
}

export default ShipmentHeaderForm

