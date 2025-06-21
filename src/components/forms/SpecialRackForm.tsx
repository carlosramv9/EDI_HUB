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
import { useSpecialRackContext } from '@/providers/special-rack/SpecialRackProvider';

const inputClasses = classNames(
    "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm",
    "invalid:border-red-500 invalid:text-red-600"
)
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const SpecialRackForm = () => {
    const router = useRouter();
    const orderData: IOrder = useAppSelector((state) => state.orders.data) || {};
    const loading: boolean = useAppSelector((state) => state.orders.loading);
    const { getOrderById } = useOrders();
    const { register, errors, handleSubmit, setValue, getSpecialRackByOrderId, createSpecialRack, dowloadLabel, specialRack, clearRegister } = useSpecialRackContext();

    const params = useParams();
    const id = params.id || '';

    useEffect(() => {
        clearRegister();
        setValue('supplierCode', "A361-01");
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    await getSpecialRackByOrderId(parseInt(id as string));
                } catch (error) {
                    await getOrderById(id as string);
                }
            }
        };
        fetchData();
    }, [id])

    useEffect(() => {
        if (orderData && id) {
            console.log(orderData)
            setValue('supplierCode', "A361-01");
            setValue('kanban', orderData?.kanban);
            setValue('whLoc', orderData?.whLocationCode);
            setValue('shopCode', orderData?.shopCode);
            setValue('mainRoute', orderData?.pickupRoute);
            setValue('srLoad', "");
            setValue('shuttleLoad', "");
            setValue('shuttleLoad2', "");
            setValue('supplierArea', "");
        }
    }, [orderData])

    useEffect(() => {
        if (specialRack && id) {
            console.log(specialRack)
            setValue('srLoad', specialRack?.srLoad);
            setValue('shuttleLoad', specialRack?.shuttleLoad);
            setValue('shuttleLoad2', specialRack?.shuttleLoad2);
            setValue('supplierArea', specialRack?.supplierArea);
            setValue('mainRoute', specialRack?.mainRoute);
            setValue('shopCode', specialRack?.shopCode);
            setValue('kanban', specialRack?.kanban);
            setValue('whLoc', specialRack?.whLoc);
            setValue('supplierCode', specialRack?.supplierCode);
        }
    }, [specialRack])

    const processData = handleSubmit(async (data: any) => {
        await createSpecialRack({ ...data, orderId: Number(id) });
    })

    const handleDownload = () => {
        dowloadLabel(specialRack);
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
                <h2 className="text-2xl font-bold text-gray-800">Special Rack Label</h2>
            </div>

            <form onSubmit={processData} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primera columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Supplier
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses} bg-gray-50`}
                                placeholder="Supplier Code"
                                disabled
                                readOnly
                                {...register('supplierCode', { required: { value: false, message: 'Supplier Code is required' } })}
                                aria-invalid={errors.supplierCode ? 'true' : 'false'}
                            />
                            {errors.supplierCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.supplierCode.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Shop Code
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses}`}
                                {...register('shopCode', { required: { value: true, message: 'Shop Code is required' } })}
                                aria-invalid={errors.shopCode ? 'true' : 'false'}
                            />
                            {errors.shopCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shopCode.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                S/R Load
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses}`}
                                {...register('srLoad', { required: { value: false, message: 'S/R Load is required' } })}
                                aria-invalid={errors.srLoad ? 'true' : 'false'}
                            />
                            {errors.srLoad && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.srLoad.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Shuttle Load
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses}`}
                                {...register('shuttleLoad', { required: { value: false, message: 'Shuttle Load is required' } })}
                                aria-invalid={errors.shuttleLoad ? 'true' : 'false'}
                            />
                            {errors.shuttleLoad && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shuttleLoad.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Shuttle Load 2
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                {...register('shuttleLoad2', { required: { value: false, message: 'Shuttle Load 2 is required' } })}
                                aria-invalid={errors.shuttleLoad2 ? 'true' : 'false'}
                            />
                            {errors.shuttleLoad2 && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shuttleLoad2.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Segunda columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Main Route
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Main Route"
                                {...register('mainRoute', { required: { value: true, message: 'Main Route is required' } })}
                                aria-invalid={errors.mainRoute ? 'true' : 'false'}
                            />
                            {errors.mainRoute && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.mainRoute.message}
                                </p>
                            )}
                        </div>
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
                                Supplier Area
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Supplier Area"
                                {...register('supplierArea', { required: { value: false, message: 'Supplier Area is required' } })}
                                aria-invalid={errors.supplierArea ? 'true' : 'false'}
                            />
                            {errors.supplierArea && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.supplierArea.message}
                                </p>
                            )}
                        </div>
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

export default SpecialRackForm