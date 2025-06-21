'use client'

import React, { useEffect, useState } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import classNames from 'classnames';
import { useAppSelector } from '@/app/store';
import { IOrder } from '@/interfaces/orders/IOrder';
import { useParams, useSearchParams } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from '@/navigation';
import { useSkidManifestContext } from '@/providers/skidManifest/SkidManifestProvider';

const inputClasses = classNames(
    "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm",
    "invalid:border-red-500 invalid:text-red-600"
)
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const SkidManifestForm = () => {
    const router = useRouter();
    const orderData: IOrder = useAppSelector((state) => state.orders.data) || {};
    const loading: boolean = useAppSelector((state) => state.orders.loading);
    const { getOrderById } = useOrders();
    const { register, errors, handleSubmit, setValue, getSkidManifestByOrderId, createSkidManifest, dowloadLabel, manifest } = useSkidManifestContext();

    const params = useParams();
    const id = params.id || '';

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    await getSkidManifestByOrderId(parseInt(id as string));
                } catch (error) {
                    await getOrderById(id as string);
                }
            }
        };
        fetchData();
    }, [id])

    useEffect(() => {
        setValue('partNumber', orderData?.partNumber);
        setValue('doNumber', orderData?.orderNumber);
        setValue('partName', orderData?.partName);
        setValue('supplierUse', 'A361-01');
        setValue('shipDate', dayjs(orderData?.shipDate).format('YYYY-MM-DD'));
        setValue('ecsNumber', orderData?.ecs);
        setValue('quantity', orderData?.quantity);
        setValue('lineDeliveryCode', orderData?.lineDeliveryCycle);
        setValue('quantityRack', orderData?.quantityRack);
        setValue('kanban', orderData?.kanban);
        setValue('whLoc', orderData?.whLocationCode);
        setValue('orderCode', orderData?.orderCode);
        setValue('fitLoc', orderData?.fitLocation);
        setValue('deliveryCode', orderData?.lineDeliveryCycle);
        setValue('purchaseOrderNumber', orderData?.orderNumber);
        setValue('mfgDate', dayjs(orderData?.shipDate).format('YYYY-MM-DD'));
        setValue('revision', '0');
    }, [orderData])

    // useEffect(() => {
    //     setValue('partNumber', manifest?.partNumber);
    //     setValue('doNumber', manifest?.orderNumber);
    //     setValue('partName', manifest?.partName);
    //     setValue('supplierUse', 'A361-01');
    //     setValue('shipDate', dayjs(manifest?.shipDate).format('YYYY-MM-DD'));
    //     // setValue('ecsNumber', manifest?.ecsNumber);
    //     setValue('quantity', manifest?.quantity);
    //     setValue('lineDeliveryCode', manifest?.lineDeliveryCycle);
    //     setValue('quantityRack', manifest?.quantityRack);
    //     setValue('kanban', manifest?.kanban);
    //     setValue('whLoc', manifest?.whLocationCode);
    //     setValue('orderCode', manifest?.orderCode);
    //     setValue('fitLoc', manifest?.fitLocation);
    //     setValue('deliveryCode', manifest?.lineDeliveryCycle);
    //     setValue('purchaseOrderNumber', manifest?.orderNumber);
    //     setValue('mfgDate', dayjs(manifest?.shipDate).format('YYYY-MM-DD'));
    //     setValue('revision', '0');
    // }, [manifest])

    const processData = handleSubmit(async (data: any) => {
        await createSkidManifest({ ...data, orderId: Number(id) });
    })

    const handleDownload = () => {
        dowloadLabel(manifest);
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <button
                    type="button"
                    className="px-4 py-2 rounded-md"
                    onClick={() => router.back()}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Pallet Master Label</h2>
            </div>

            <form onSubmit={processData} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primera columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Part Number
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Part Number"
                                {...register('partNumber', { required: { value: true, message: 'Part Number is required' } })}
                                aria-invalid={errors.partNumber ? 'true' : 'false'}
                            />
                            {errors.partNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.partNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                D/O #
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses} bg-gray-50`}
                                // defaultValue="A361-01"
                                {...register('doNumber', { required: { value: true, message: 'D/O # is required' } })}
                                aria-invalid={errors.doNumber ? 'true' : 'false'}
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Part Name
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses} bg-gray-50`}
                                // defaultValue="A361-01"
                                {...register('partName', { required: { value: true, message: 'Part Name is required' } })}
                                aria-invalid={errors.partName ? 'true' : 'false'}
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Supplier Code
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses} bg-gray-50`}
                                // defaultValue="A361-01"
                                {...register('supplierUse', { required: { value: true, message: 'Supplier Code is required' } })}
                                aria-invalid={errors.supplierUse ? 'true' : 'false'}
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                ECS #
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                {...register('ecsNumber', { required: { value: true, message: 'ECS # is required' } })}
                                aria-invalid={errors.ecsNumber ? 'true' : 'false'}
                            />
                            {errors.ecsNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.ecsNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Quantity
                            </label>
                            <input
                                type="number"
                                className={inputClasses}
                                placeholder="Quantity"
                                {...register('quantity', { required: { value: true, message: 'Quantity is required' } })}
                                aria-invalid={errors.quantity ? 'true' : 'false'}
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Line Delivery Cycle
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Line Delivery Cycle"
                                {...register('lineDeliveryCode', { required: { value: true, message: 'Line Delivery Cycle is required' } })}
                                aria-invalid={errors.lineDeliveryCode ? 'true' : 'false'}
                            />
                            {errors.lineDeliveryCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.lineDeliveryCode.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Segunda columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Kanban
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Kanban"
                                {...register('kanban', { required: { value: true, message: 'Kanban is required' } })}
                                aria-invalid={errors.kanban ? 'true' : 'false'}
                            />
                            {errors.kanban && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.kanban.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                WH Location
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="WH Location"
                                {...register('whLoc', { required: { value: true, message: 'WH Location is required' } })}
                                aria-invalid={errors.whLoc ? 'true' : 'false'}
                            />
                            {errors.whLoc && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.whLoc.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Order Code
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Order Code"
                                {...register('orderCode', { required: { value: true, message: 'Order Code is required' } })}
                                aria-invalid={errors.orderCode ? 'true' : 'false'}
                            />
                            {errors.orderCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.orderCode.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Ship Date
                            </label>
                            <input
                                type="date"
                                className={inputClasses}
                                placeholder="Ship Date"
                                {...register('shipDate', { required: { value: true, message: 'Ship Date is required' } })}
                                aria-invalid={errors.shipDate ? 'true' : 'false'}
                            />
                            {errors.shipDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shipDate.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Fit Location
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Fit Location"
                                {...register('fitLoc', { required: { value: true, message: 'Fit Location is required' } })}
                                aria-invalid={errors.fitLoc ? 'true' : 'false'}
                            />
                            {errors.fitLoc && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fitLoc.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Pallets Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="flex flex-col">
                        <label className={labelClasses}>
                            Quantity Rack
                        </label>
                        <input
                            type="number"
                            className={inputClasses}
                            placeholder="Quantity Rack"
                            {...register('quantityRack', { required: { value: true, message: 'Quantity Rack is required' } })}
                            aria-invalid={errors.quantityRack ? 'true' : 'false'}
                        />
                        {errors.quantityRack && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.quantityRack.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Imprimir
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SkidManifestForm