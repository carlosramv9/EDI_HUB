'use client'

import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/store'
import { openForm, updateAsnHeader, updateDetail, setLoading, closeForm } from '@/store/features/asnHeader/asnHeaderFormSlice'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { IAsnHeader } from '@/interfaces/asn/IAsnHeader'
import { IAdvanceShippingNotice } from '@/interfaces/asn/IAdvanceShippingNotice'
import { asnHeaderApi } from '@/services/api/asn/asnHeaderApi'
import { clearSelectedOrders } from '@/store/features/selectedOrders/selectedOrdersSlice'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import MainLayout from '@/components/layouts/MainLayout'
import Loader from '@/components/ui/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { apiASN } from '@/services/api/subaru/ASNApi'
import Swal from 'sweetalert2'

const CreateShipmentPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const t = useTranslations()
    const selectedOrders = useAppSelector((state) => state.selectedOrders.selectedOrders)
    const { asnHeader, loading } = useAppSelector((state) => state.asnHeaderForm)
    const [formData, setFormData] = useState<IAsnHeader | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Inicializar el formulario cuando se carga la página
    useEffect(() => {
        if (selectedOrders.length < 2) {
            toast.warning('Debe seleccionar al menos 2 órdenes para crear un envío')
            router.push('/schedules')
            return
        }

        // Inicializar el ASN Header con datos de las órdenes seleccionadas
        const firstOrder = selectedOrders[0]
        const initialAsnHeader: IAsnHeader = {
            shipDate: firstOrder.shipDate,
            quantity: selectedOrders.reduce((sum, order) => sum + (order.quantity || 0), 0),
            details: selectedOrders.map(order => ({
                orderId: order.id,
                partNumber: order.partNumber,
                quantity: order.quantity,
                devOrderNumber: order.orderNumber,
                engChange: order.ecs,
                shipDate: order.shipDate,
                partUnit: 'EA'
            } as IAdvanceShippingNotice))
        }
        console.log(initialAsnHeader)
        dispatch(openForm(selectedOrders))
        setFormData(initialAsnHeader)
    }, [])

    // useEffect(() => {
    //     if (asnHeader) {
    //         setFormData({ ...asnHeader })
    //     }
    // }, [asnHeader])

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
        const newErrors: Record<string, string> = {}

        if (!formData?.scacCode) {
            newErrors.scacCode = 'El código SCAC es requerido'
        }
        if (!formData?.carrier) {
            newErrors.carrier = 'El transportista es requerido'
        }
        if (!formData?.shipDate) {
            newErrors.shipDate = 'La fecha de envío es requerida'
        }

        formData?.details?.forEach((detail, index) => {
            if (!detail.partNumber) {
                newErrors[`detail_${index}_partNumber`] = 'El número de parte es requerido'
            }
            if (!detail.quantity || detail.quantity <= 0) {
                newErrors[`detail_${index}_quantity`] = 'La cantidad debe ser mayor a 0'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm() || !formData) {
            console.log(errors)
            toast.error('Por favor, complete todos los campos requeridos')
            return
        }

        dispatch(setLoading(true))
        try {
            console.log(formData)
            await apiASN.uploadMultiShipping({ formData })
            toast.success('Envío creado exitosamente')
            // dispatch(clearSelectedOrders())
            // dispatch(closeForm())
            //router.push('/schedules')
        } catch (error: any) {
            console.error('Error creating shipment:', error)
            toast.error(error?.message || 'Error al crear el envío')
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleSendMultiShipping = async () => {
        if (!validateForm() || !formData) {
            console.log(errors)
            toast.error('Por favor, complete todos los campos requeridos')
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
            
            // dispatch(clearSelectedOrders())
            // dispatch(closeForm())
            //router.push('/schedules')
        } catch (error: any) {
            console.error('Error sending shipment:', error)
            
            // Mostrar SweetAlert de error
            await Swal.fire({
                title: t('sendError'),
                text: error?.message || 'Error al enviar el envío',
                icon: 'error',
                confirmButtonColor: '#dc2626',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'dark:bg-gray-800',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300',
                    confirmButton: 'px-4 py-2 text-white font-medium rounded-lg'
                }
            })
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCancel = () => {
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
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4 flex items-center gap-2 transition-colors"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>{t('back') || 'Volver'}</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {t('createShipment') || 'Crear Envío'}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {t('createShipmentDescription') || `Crear un nuevo envío con ${selectedOrders.length} ${selectedOrders.length === 1 ? 'orden seleccionada' : 'órdenes seleccionadas'}`}
                    </p>
                </div>

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
                    {/* Información del Header */}
                    <div className="rounded-lg p-6 border border-gray-400/75 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {t('headerInformation') || 'Información del Envío'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('scacCode') || 'Código SCAC'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.scacCode || ''}
                                    onChange={(e) => handleHeaderChange('scacCode', e.target.value)}
                                    placeholder={t('scacCodePlaceholder') || 'Ingrese el código SCAC'}
                                    className={errors.scacCode ? 'border-red-500' : ''}
                                />
                                {errors.scacCode && (
                                    <p className="text-red-500 text-xs">{errors.scacCode}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Carrier <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={formData.carrier || ''}
                                    onChange={(e) => handleHeaderChange('carrier', e.target.value)}
                                    placeholder={t('carrierPlaceholder') || 'Ingrese el transportista'}
                                    className={errors.carrier ? 'border-red-500' : ''}
                                />
                                {errors.carrier && (
                                    <p className="text-red-500 text-xs">{errors.carrier}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('billOfLanding') || 'Conocimiento de Embarque'}
                                </label>
                                <Input
                                    value={formData.billOfLanding || ''}
                                    onChange={(e) => handleHeaderChange('billOfLanding', e.target.value)}
                                    placeholder={t('billOfLandingPlaceholder') || 'Ingrese el conocimiento de embarque'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Packing List
                                </label>
                                <Input
                                    value={formData.packingList || ''}
                                    onChange={(e) => handleHeaderChange('packingList', e.target.value)}
                                    placeholder={t('packingListPlaceholder') || 'Ingrese la lista de empaque'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Carrier's Reference Number (PRO/Invoice)
                                </label>
                                <Input
                                    value={formData.carrierRef || ''}
                                    onChange={(e) => handleHeaderChange('carrierRef', e.target.value)}
                                    placeholder={t('carrierRefPlaceholder') || 'Ingrese la referencia del transportista'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('shipDate') || 'Fecha de Envío'} <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={formData.shipDate ? dayjs(formData.shipDate).format('YYYY-MM-DD') : ''}
                                    onChange={(e) => handleHeaderChange('shipDate', e.target.value)}
                                    className={errors.shipDate ? 'border-red-500' : ''}
                                />
                                {errors.shipDate && (
                                    <p className="text-red-500 text-xs">{errors.shipDate}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Router Number
                                </label>
                                <Input
                                    value={formData.routerNumber || ''}
                                    onChange={(e) => handleHeaderChange('routerNumber', e.target.value)}
                                    placeholder={t('routerNumberPlaceholder') || 'Ingrese el número de ruta'}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Authorization Number
                                </label>
                                <Input
                                    value={formData.authorizationNumber || ''}
                                    onChange={(e) => handleHeaderChange('authorizationNumber', e.target.value)}
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
                                    onChange={(e) => handleHeaderChange('quantity', parseInt(e.target.value) || 0)}
                                    readOnly
                                    className="bg-gray-100 dark:bg-gray-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detalles de las Órdenes */}
                    <div className="rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {t('orderDetails') || 'Detalles de las Órdenes'}
                        </h3>
                        <div className="space-y-4">
                            {formData.details?.map((detail, index) => {
                                const order = selectedOrders[index]
                                return (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {t('order') || 'Orden'} #{index + 1}: {order?.orderNumber || 'N/A'}
                                            </h4>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {order?.partName || 'Sin nombre'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('partNumber') || 'Número de Parte'} <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    value={detail.partNumber || ''}
                                                    onChange={(e) => handleDetailChange(index, 'partNumber', e.target.value)}
                                                    placeholder={t('partNumberPlaceholder') || 'Número de parte'}
                                                    className={errors[`detail_${index}_partNumber`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`detail_${index}_partNumber`] && (
                                                    <p className="text-red-500 text-xs">{errors[`detail_${index}_partNumber`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('quantity') || 'Cantidad'} <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={detail.quantity || 0}
                                                    onChange={(e) => handleDetailChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    placeholder={t('quantityPlaceholder') || 'Cantidad'}
                                                    className={errors[`detail_${index}_quantity`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`detail_${index}_quantity`] && (
                                                    <p className="text-red-500 text-xs">{errors[`detail_${index}_quantity`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Delivery Order Number
                                                </label>
                                                <Input
                                                    value={detail.devOrderNumber || ''}
                                                    onChange={(e) => handleDetailChange(index, 'devOrderNumber', e.target.value)}
                                                    placeholder={t('devOrderNumberPlaceholder') || 'Número de orden'}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Engineering Change
                                                </label>
                                                <Input
                                                    value={detail.engChange || ''}
                                                    onChange={(e) => handleDetailChange(index, 'engChange', e.target.value)}
                                                    placeholder={t('engChangePlaceholder') || 'Cambio de ingeniería'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

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
                        {/* <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                            {loading ? (
                                <>
                                    <Loader />
                                    {t('creating') || 'Creando...'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('saveShipment') || 'Guardar Envío'}
                                </>
                            )}
                        </Button> */}
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

