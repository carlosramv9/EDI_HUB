'use client'

import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/store'
import { openForm, updateAsnHeader, updateDetail, setLoading, closeForm } from '@/store/features/asnHeader/asnHeaderFormSlice'
import { Button } from '@/components/ui/Button'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
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

const CreateShipmentPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const t = useTranslations()
    const selectedOrders = useAppSelector((state) => state.selectedOrders.selectedOrders)
    const { loading } = useAppSelector((state) => state.asnHeaderForm)
    
    const [formData, setFormData] = useState<IAsnHeader | null>(null)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
    const [viewMode, setViewMode] = useState<'compact' | 'full'>('full')
    
    // Guardar borrador automáticamente cuando cambia formData
    useEffect(() => {
        if (formData) {
            const timeoutId = setTimeout(() => {
                saveShipmentDraft(formData, selectedOrders)
            }, 1000) // Debounce de 1 segundo
            
            return () => clearTimeout(timeoutId)
        }
    }, [formData, selectedOrders])
    
    // Cambiar a vista compacta automáticamente si hay más de 5 órdenes
    useEffect(() => {
        if (selectedOrders.length > 5) {
            setViewMode('compact')
        }
    }, [selectedOrders.length])

    // Inicializar el formulario cuando se carga la página
    useEffect(() => {
        // Intentar cargar borrador primero
        const draft = loadShipmentDraft()
        
        if (draft && draft.selectedOrders.length >= 1) {
            // Restaurar desde borrador
            const restore = window.confirm(
                t('restoreDraft')?.replace('{count}', draft.selectedOrders.length.toString()) || 
                `¿Desea restaurar el borrador guardado con ${draft.selectedOrders.length} órdenes?`
            )
            
            if (restore) {
                dispatch(openForm(draft.selectedOrders))
                setFormData(draft.formData)
                toast.info(t('draftRestored') || 'Borrador restaurado exitosamente')
                return
            } else {
                clearShipmentDraft()
            }
        }

        // Si no hay borrador o el usuario no quiere restaurarlo, validar selección actual
        if (selectedOrders.length < 1) {
            toast.warning(t('selectAtLeastOneOrder') || 'Debe seleccionar al menos 1 orden para crear un envío')
            router.push('/schedules')
            return
        }

        // Inicializar el ASN Header con datos de las órdenes seleccionadas
        const initialAsnHeader = initializeAsnHeaderFromOrders(selectedOrders)
        dispatch(openForm(selectedOrders))
        setFormData(initialAsnHeader)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleHeaderChange = (field: keyof IAsnHeader, value: any) => {
        if (formData) {
            const updated = { ...formData, [field]: value }
            setFormData(updated)
            dispatch(updateAsnHeader(updated))
        }
    }

    const handleDetailChange = (index: number, field: keyof IAdvanceShippingNotice, value: any) => {
        if (formData?.details) {
            const updatedDetails = [...formData.details]
            updatedDetails[index] = { ...updatedDetails[index], [field]: value }
            const updated = { ...formData, details: updatedDetails }
            setFormData(updated)
            dispatch(updateDetail({ index, detail: { [field]: value } }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors = validateShipmentForm(formData, t)
        setErrors(newErrors)
        
        if (Object.keys(newErrors).length > 0) {
            scrollToFirstError(newErrors)
        }
        
        return Object.keys(newErrors).length === 0
    }

    const toggleOrderExpansion = (index: number) => {
        const newExpanded = new Set(expandedOrders)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedOrders(newExpanded)
    }

    const expandAll = () => {
        setExpandedOrders(new Set(selectedOrders.map((_, index) => index)))
    }

    const collapseAll = () => {
        setExpandedOrders(new Set())
    }

    const handleSendMultiShipping = async () => {
        if (!validateForm() || !formData) {
            const errorCount = Object.keys(errors).length
            toast.error(
                errorCount > 0 
                    ? t('errorValidationCount', { count: errorCount }) || 
                        `Por favor, corrija ${errorCount} ${errorCount === 1 ? 'error' : 'errores'} antes de continuar`
                    : t('errorCompleteRequired') || 'Por favor, complete todos los campos requeridos'
            )
            return
        }

        // Mostrar SweetAlert de confirmación
        const result = await Swal.fire({
            title: t('confirmSendTitle'),
            text: t('confirmSendText', { count: selectedOrders.length }),
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
            await apiASN.sendMultiShipping({ formData })
            
            // Limpiar borrador al guardar exitosamente
            clearShipmentDraft()
            
            // Mostrar SweetAlert de éxito
            await Swal.fire({
                title: t('sendSuccess'),
                icon: 'success',
                confirmButtonColor: '#16a34a',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'dark:bg-gray-800',
                    title: 'dark:text-white',
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

    if (!formData) {
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

                <div className="space-y-6">
                    <ShipmentHeaderForm
                        formData={formData}
                        errors={errors}
                        onFieldChange={handleHeaderChange}
                    />

                    <OrderDetailsList
                        formData={formData}
                        selectedOrders={selectedOrders}
                        errors={errors}
                        viewMode={viewMode}
                        expandedOrders={expandedOrders}
                        onDetailChange={handleDetailChange}
                        onToggleOrderExpansion={toggleOrderExpansion}
                        onExpandAll={expandAll}
                        onCollapseAll={collapseAll}
                        onViewModeChange={setViewMode}
                    />

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
