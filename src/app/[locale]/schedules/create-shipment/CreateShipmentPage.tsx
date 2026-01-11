'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/store'
import { openForm, updateAsnHeader, updateDetail, setLoading, closeForm } from '@/store/features/asnHeader/asnHeaderFormSlice'
import { Button } from '@/components/ui/Button'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { IOrder } from '@/interfaces/orders/IOrder'
import { clearSelectedOrders } from '@/store/features/selectedOrders/selectedOrdersSlice'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { toast } from 'react-toastify'
import MainLayout from '@/components/layouts/MainLayout'
import Loader from '@/components/ui/Loader'
import { apiASN } from '@/services/api/subaru/ASNApi'
import Swal from 'sweetalert2'

// Helpers
import { saveShipmentDraft, loadShipmentDraft, clearShipmentDraft } from '@/helpers/shipment/shipmentDraftStorage'
import { validateShipmentForm, scrollToFirstError, ValidationErrors } from '@/helpers/shipment/shipmentValidation'
import { getShipmentErrorMessage, getErrorDetailsHtml } from '@/helpers/shipment/shipmentErrorHandler'
import { initializeAsnHeaderFromOrders } from '@/helpers/shipment/shipmentInitializer'

// Components
import ShipmentPageHeader from './components/ShipmentPageHeader'
import ShipmentHeaderForm from './components/ShipmentHeaderForm'
import OrderDetailsList from './components/OrderDetailsList'

interface GroupedFormData {
    [type: string]: IAsnHeader
}

interface GroupedErrors {
    [type: string]: ValidationErrors
}

interface GroupedExpandedOrders {
    [type: string]: Set<number>
}

interface GroupedViewMode {
    [type: string]: 'compact' | 'full'
}

const CreateShipmentPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const t = useTranslations()
    const selectedOrders = useAppSelector((state) => state.selectedOrders.selectedOrders)
    const { loading } = useAppSelector((state) => state.asnHeaderForm)
    
    const [formDataByType, setFormDataByType] = useState<GroupedFormData>({})
    const [errorsByType, setErrorsByType] = useState<GroupedErrors>({})
    const [expandedOrdersByType, setExpandedOrdersByType] = useState<GroupedExpandedOrders>({})
    const [viewModeByType, setViewModeByType] = useState<GroupedViewMode>({})
    
    // Agrupar órdenes por tipo
    const ordersByType = useMemo(() => {
        return selectedOrders.reduce((acc, order) => {
            const type = order.type || 'Sin Tipo'
            if (!acc[type]) {
                acc[type] = []
            }
            acc[type].push(order)
            return acc
        }, {} as Record<string, IOrder[]>)
    }, [selectedOrders])
    
    // Cambiar a vista compacta automáticamente si hay más de 5 órdenes en un tipo
    useEffect(() => {
        const newViewModes: GroupedViewMode = {}
        Object.entries(ordersByType).forEach(([type, orders]) => {
            newViewModes[type] = orders.length > 5 ? 'compact' : 'full'
        })
        setViewModeByType(newViewModes)
    }, [ordersByType])

    // Inicializar el formulario cuando se carga la página
    useEffect(() => {
        // Si no hay órdenes seleccionadas, redirigir
        if (selectedOrders.length < 1) {
            toast.warning(t('selectAtLeastOneOrder') || 'Debe seleccionar al menos 1 orden para crear un envío')
            router.push('/schedules')
            return
        }

        // Inicializar formularios por tipo
        const newFormDataByType: GroupedFormData = {}
        const newExpandedOrdersByType: GroupedExpandedOrders = {}
        
        Object.entries(ordersByType).forEach(([type, orders]) => {
            newFormDataByType[type] = initializeAsnHeaderFromOrders(orders)
            newExpandedOrdersByType[type] = new Set()
        })
        
        setFormDataByType(newFormDataByType)
        setExpandedOrdersByType(newExpandedOrdersByType)
        dispatch(openForm(selectedOrders))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleHeaderChange = (type: string, field: keyof IAsnHeader, value: any) => {
        const formData = formDataByType[type]
        if (formData) {
            const updated = { ...formData, [field]: value }
            setFormDataByType(prev => ({ ...prev, [type]: updated }))
            dispatch(updateAsnHeader(updated))
        }
    }

    const handleDetailChange = (type: string, index: number, field: keyof IAdvanceShippingNotice, value: any) => {
        const formData = formDataByType[type]
        if (formData?.details) {
            const updatedDetails = [...formData.details]
            updatedDetails[index] = { ...updatedDetails[index], [field]: value }
            const updated = { ...formData, details: updatedDetails }
            setFormDataByType(prev => ({ ...prev, [type]: updated }))
            dispatch(updateDetail({ index, detail: { [field]: value } }))
        }
    }

    const validateAllForms = (): boolean => {
        const newErrorsByType: GroupedErrors = {}
        let hasErrors = false
        
        Object.entries(formDataByType).forEach(([type, formData]) => {
            const errors = validateShipmentForm(formData, t)
            if (Object.keys(errors).length > 0) {
                newErrorsByType[type] = errors
                hasErrors = true
            }
        })
        
        setErrorsByType(newErrorsByType)
        
        if (hasErrors) {
            // Scroll al primer error del primer tipo
            const firstType = Object.keys(newErrorsByType)[0]
            if (firstType && newErrorsByType[firstType]) {
                scrollToFirstError(newErrorsByType[firstType])
            }
        }
        
        return !hasErrors
    }

    const toggleOrderExpansion = (type: string, index: number) => {
        setExpandedOrdersByType(prev => {
            const newExpanded = new Set(prev[type] || new Set())
            if (newExpanded.has(index)) {
                newExpanded.delete(index)
            } else {
                newExpanded.add(index)
            }
            return { ...prev, [type]: newExpanded }
        })
    }

    const expandAll = (type: string) => {
        const orders = ordersByType[type] || []
        setExpandedOrdersByType(prev => ({
            ...prev,
            [type]: new Set(orders.map((_, index) => index))
        }))
    }

    const collapseAll = (type: string) => {
        setExpandedOrdersByType(prev => ({
            ...prev,
            [type]: new Set()
        }))
    }
    
    const handleViewModeChange = (type: string, mode: 'compact' | 'full') => {
        setViewModeByType(prev => ({ ...prev, [type]: mode }))
    }

    const handleSendMultiShipping = async () => {
        if (!validateAllForms()) {
            const totalErrors = Object.values(errorsByType).reduce(
                (count, errors) => count + Object.keys(errors).length, 
                0
            )
            toast.error(
                totalErrors > 0 
                    ? t('errorValidationCount', { count: totalErrors }) || 
                        `Por favor, corrija ${totalErrors} ${totalErrors === 1 ? 'error' : 'errores'} antes de continuar`
                    : t('errorCompleteRequired') || 'Por favor, complete todos los campos requeridos'
            )
            return
        }

        const totalOrders = Object.values(ordersByType).reduce((sum, orders) => sum + orders.length, 0)
        const typeCount = Object.keys(ordersByType).length

        // Mostrar SweetAlert de confirmación
        const result = await Swal.fire({
            title: t('confirmSendTitle'),
            html: `${t('confirmSendText', { count: totalOrders }) || `¿Desea enviar ${totalOrders} órdenes?`}<br/><small>(${typeCount} ${typeCount === 1 ? 'tipo' : 'tipos'} de orden)</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#dc2626',
            confirmButtonText: t('confirmButton'),
            cancelButtonText: t('cancelButton'),
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: 'dark:bg-gray-800',
                title: 'dark:text-white',
                htmlContainer: 'dark:text-gray-300',
                confirmButton: 'px-4 py-2 text-white font-medium rounded-lg',
                cancelButton: 'px-4 py-2 text-white font-medium rounded-lg'
            }
        })

        // Si el usuario cancela, salir de la función
        if (!result.isConfirmed) {
            return
        }

        dispatch(setLoading(true))
        try {
            // Recopilar todos los headers de todos los tipos en un solo array
            const allHeaders = Object.values(formDataByType)
            
            // Validar que haya al menos un header
            if (allHeaders.length === 0) {
                throw new Error('No hay headers para enviar')
            }
            
            // Enviar todos los headers en una sola llamada
            await apiASN.sendMultiShipping({ headers: allHeaders })
            
            // Limpiar borrador al guardar exitosamente
            clearShipmentDraft()
            
            // Mostrar SweetAlert de éxito
            await Swal.fire({
                title: t('sendSuccess'),
                html: `Se enviaron exitosamente ${totalOrders} órdenes en ${typeCount} ${typeCount === 1 ? 'tipo' : 'tipos'} de orden`,
                icon: 'success',
                confirmButtonColor: '#16a34a',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'dark:bg-gray-800',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300',
                    confirmButton: 'px-4 py-2 text-white font-medium rounded-lg'
                }
            })
            
            dispatch(clearSelectedOrders())
            dispatch(closeForm())
            router.push('/schedules')
        } catch (error: any) {
            console.error('Error sending shipment:', error)
            const errorMessage = getShipmentErrorMessage(error, t)
            
            // Mostrar SweetAlert de error con detalles
            await Swal.fire({
                title: t('sendError'),
                html: getErrorDetailsHtml(error, errorMessage),
                icon: 'error',
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'OK',
                width: '500px',
                customClass: {
                    popup: 'dark:bg-gray-800',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300 text-left',
                    confirmButton: 'px-4 py-2 text-white font-medium rounded-lg'
                }
            })
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCancel = () => {
        // Limpiar borrador al cancelar voluntariamente
        clearShipmentDraft()
        dispatch(closeForm())
        router.push('/schedules')
    }

    if (Object.keys(formDataByType).length === 0) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader />
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <ShipmentPageHeader 
                    onBack={handleCancel}
                    selectedOrdersCount={selectedOrders.length}
                />

                {loading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <Loader />
                            <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                                {t('creating') || 'Creando envío...'}
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {Object.entries(ordersByType).map(([type, orders]) => {
                        const formData = formDataByType[type]
                        const errors = errorsByType[type] || {}
                        const viewMode = viewModeByType[type] || 'full'
                        const expandedOrders = expandedOrdersByType[type] || new Set()

                        return (
                            <div key={type} className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-white dark:bg-gray-900 shadow-lg">
                                {/* Encabezado del tipo */}
                                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                            {type}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                            ({orders.length} {orders.length === 1 ? 'orden' : 'órdenes'})
                                        </span>
                                    </h2>
                                </div>

                                {/* Formulario de encabezado */}
                                <div className="mb-6">
                                    <ShipmentHeaderForm
                                        formData={formData}
                                        errors={errors}
                                        onFieldChange={(field, value) => handleHeaderChange(type, field, value)}
                                    />
                                </div>

                                {/* Lista de detalles de órdenes */}
                                <OrderDetailsList
                                    formData={formData}
                                    selectedOrders={orders}
                                    errors={errors}
                                    viewMode={viewMode}
                                    expandedOrders={expandedOrders}
                                    onDetailChange={(index, field, value) => handleDetailChange(type, index, field, value)}
                                    onToggleOrderExpansion={(index) => toggleOrderExpansion(type, index)}
                                    onExpandAll={() => expandAll(type)}
                                    onCollapseAll={() => collapseAll(type)}
                                    onViewModeChange={(mode) => handleViewModeChange(type, mode)}
                                />
                            </div>
                        )
                    })}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-6"
                        >
                            {t('cancel') || 'Cancelar'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSendMultiShipping}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6"
                        >
                            {loading ? (
                                <>
                                    <Loader />
                                    {t('sending') || 'Enviando...'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('send') || 'Enviar'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CreateShipmentPage
