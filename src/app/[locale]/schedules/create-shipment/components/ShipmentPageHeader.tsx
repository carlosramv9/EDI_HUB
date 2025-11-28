'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from 'next-intl'

interface ShipmentPageHeaderProps {
    onBack: () => void
    selectedOrdersCount: number
}

const ShipmentPageHeader = ({ onBack, selectedOrdersCount }: ShipmentPageHeaderProps) => {
    const t = useTranslations()

    return (
        <div className="mb-6">
            <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4 flex items-center gap-2 transition-colors"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>{t('back') || 'Volver'}</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t('createShipment') || 'Crear Envío'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('createShipmentDescription') || 
                    `Crear un nuevo envío con ${selectedOrdersCount} ${selectedOrdersCount === 1 ? 'orden seleccionada' : 'órdenes seleccionadas'}`}
            </p>
        </div>
    )
}

export default ShipmentPageHeader

