'use client'

import React, { useEffect } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { IOrder } from '@/interfaces/orders/IOrder';
import { useParams, useSearchParams } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from '@/navigation';
import { clearOrder, getOrdersFailure } from '@/store/features/orders/orderSlice';
import { toast } from 'react-toastify';

const inputClasses = classNames(
    "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm",
    "invalid:border-red-500 invalid:text-red-600"
)
const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"

const ScheduleForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const order: IOrder = useAppSelector((state) => state.orders.data) || {};
    const loading: boolean = useAppSelector((state) => state.orders.loading);
    const { register, errors, handleSubmit, getOrderById, setValue, updateOrder, createOrder } = useOrders();

    const params = useParams();
    const id = params.id || '';

    useEffect(() => {
        if (id) {
            getOrderById(id as string);
        }
    }, [id])

    useEffect(() => {
        setValue('asnNumber', order?.asnNumber);
        setValue('orderNumber', order?.orderNumber);
        setValue('partNumber', order?.partNumber);
        setValue('partName', order?.partName);
        setValue('shipDate', dayjs(order?.shipDate).format('YYYY-MM-DD'));
        // setValue('shipTime', dayjs(order?.shipTime).format('HH:mm'));
        setValue('quantity', order?.quantity);
        setValue('quantityRack', order?.quantityRack);
        setValue('shipTo', order?.shipTo);
        setValue('orderCode', order?.orderCode);
        setValue('pickupRoute', order?.pickupRoute);
        setValue('kanban', order?.kanban);
        setValue('quantity', order?.quantity);
        setValue('quantityRack', order?.quantityRack);
        setValue('shipTo', order?.shipTo);
        setValue('orderCode', order?.orderCode);
        setValue('pickupRoute', order?.pickupRoute);
        setValue('shopCode', order?.shopCode);

    }, [order])


    const processData = handleSubmit(async (data) => {
        try {
            order
                ? await updateOrder({...order, ...data})
                : await createOrder(data);
            toast.success('Order saved successfully');
        } catch (error) {
            toast.error('Error saving order');
            dispatch(getOrdersFailure(error));
        }
    })

    const returnPage = () => {
        dispatch(clearOrder());
        router.back();
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
                    onClick={returnPage}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Schedule {order?.orderNumber}</h2>
            </div>

            <form onSubmit={processData} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primera columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                ASN Number
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="ASN Number"
                                {...register('asnNumber', { required: { value: true, message: 'ASN Number is required' } })}
                                aria-invalid={errors.asnNumber ? 'true' : 'false'}
                            />
                            {errors.asnNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.asnNumber.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Supplier Code
                            </label>
                            <input
                                type="text"
                                className={`${inputClasses} bg-gray-50`}
                                defaultValue="A361-01"
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Ship Date
                            </label>
                            <input
                                type="date"
                                className={inputClasses}
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
                                Route Number
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Route Number"
                                {...register('pickupRoute', { required: { value: true, message: 'Route Number is required' } })}
                                aria-invalid={errors.pickupRoute ? 'true' : 'false'}
                            />
                            {errors.pickupRoute && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.pickupRoute.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Dock Code
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Dock Code"
                                {...register('shopCode', { required: { value: true, message: 'Dock Code is required' } })}
                                aria-invalid={errors.shopCode ? 'true' : 'false'}
                            />
                            {errors.shopCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.shopCode.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Segunda columna */}
                    <div className="space-y-5">
                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Destination
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Destination"
                                {...register('pickupRoute', { required: { value: true, message: 'Destination is required' } })}
                                aria-invalid={errors.pickupRoute ? 'true' : 'false'}
                            />
                            {errors.pickupRoute && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.pickupRoute.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className={labelClasses}>
                                Delivery Order
                            </label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Delivery Order"
                                {...register('orderNumber', { required: { value: true, message: 'Delivery Order is required' } })}
                                aria-invalid={errors.orderNumber ? 'true' : 'false'}
                            />
                            {errors.orderNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.orderNumber.message}
                                </p>
                            )}
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
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
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        type="button"
                        className="px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Imprimir Etiqueta
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ScheduleForm