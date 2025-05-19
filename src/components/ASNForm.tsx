'use client'
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from '@/navigation';
import { useParams } from 'next/navigation';
import { FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import classNames from 'classnames';
import { useOrders } from '@/providers/orders/OrdersProvider';
import { useAppSelector } from '@/app/store';
import { IOrder } from '@/interfaces/orders/IOrder';
import { useASN } from '@/providers/asn/ASNProvider';
import Loader from './ui/Loader';

const labelClasses = "text-sm font-medium text-gray-700 mb-1.5"
const inputClasses = classNames(
    "px-4 py-2.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 text-sm",
    "invalid:border-red-500 invalid:text-red-600"
)

const ASNForm = () => {
    const orderData: IOrder = useAppSelector((state) => state.orders.data) || {};

    const { register, handleSubmit, errors, setValue, getValues, getByOrderId, send, advanceShippingNotice, loading, setLoading, save, update } = useASN();
    const { getOrderById } = useOrders();

    const router = useRouter();
    const params = useParams();
    const id = params.id || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (id) {
                try {
                    await getByOrderId(parseInt(id as string));
                } catch (error) {
                    await getOrderById(id as string);
                }
            }
            setLoading(false);
        };
        fetchData();
        setValue('partUnit', 'EA');
    }, [id])

    useEffect(() => {
        setValue('orderId', orderData?.id || 0);
        setValue('partNumber', orderData?.partNumber || '');
        setValue('quantity', orderData?.quantity || 0);
        setValue('engChange', orderData?.ecs || '');
        setValue('devOrderNumber', orderData?.orderNumber || '');
    }, [orderData])

    useEffect(() => {
        if (advanceShippingNotice) {
            setValue('id', advanceShippingNotice?.id || 0);
            setValue('orderId', advanceShippingNotice?.orderId || 0);
            setValue('scacCode', advanceShippingNotice.scacCode);
            setValue('carrier', advanceShippingNotice.carrier);
            setValue('billOfLanding', advanceShippingNotice.billOfLanding);
            setValue('packingList', advanceShippingNotice.packingList);
            setValue('carrierRef', advanceShippingNotice.carrierRef);
            setValue('routerNumber', advanceShippingNotice.routerNumber);
            setValue('authorizationNumber', advanceShippingNotice.authorizationNumber);
            setValue('partNumber', advanceShippingNotice.partNumber);
            setValue('engChange', advanceShippingNotice.engChange);
            setValue('devOrderNumber', advanceShippingNotice.devOrderNumber);
            setValue('quantity', advanceShippingNotice.quantity);
            setValue('partUnit', advanceShippingNotice.partUnit);
        }
    }, [advanceShippingNotice])

    const onSubmit = async (data: IAdvanceShippingNotice) => {
        await send({ ...data, shipment: '', controlNumber: '' });
    };

    const saveData = async () => {
        const data = getValues()

        if (data.id) await update({ ...advanceShippingNotice, ...data });
        else await save({ ...data });
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push(`/schedules`)}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Generar ASN</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Carrier Identification Code(SCAC)</label>
                        <input
                            {...register('scacCode', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.scacCode ? 'border-red-500' : '')}
                            placeholder="Carrier Identification Code(SCAC)"
                        />
                        {errors.scacCode && <p className="text-red-500 text-xs mt-1">{errors.scacCode.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Carrier</label>
                        <input
                            {...register('carrier')}
                            className={classNames(inputClasses, errors.carrier ? 'border-red-500' : '')}
                            placeholder="Carrier"
                        />
                        {errors.carrier && <p className="text-red-500 text-xs mt-1">{errors.carrier.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Bill of Lading</label>
                        <input
                            {...register('billOfLanding', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.billOfLanding ? 'border-red-500' : '')}
                            placeholder="Bill of Lading"
                        />
                        {errors.billOfLanding && <p className="text-red-500 text-xs mt-1">{errors.billOfLanding.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Packing List</label>
                        <input
                            {...register('packingList', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.packingList ? 'border-red-500' : '')}
                            placeholder="Packing List"
                        />
                        {errors.packingList && <p className="text-red-500 text-xs mt-1">{errors.packingList.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Carrier's Reference Number (PRO/Invoice)</label>
                        <input
                            {...register('carrierRef', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.carrierRef ? 'border-red-500' : '')}
                            placeholder="Carrier's Reference Number (PRO/Invoice)"
                        />
                        {errors.carrierRef && <p className="text-red-500 text-xs mt-1">{errors.carrierRef.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Route Number</label>
                        <input
                            {...register('routerNumber', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.routerNumber ? 'border-red-500' : '')}
                            placeholder="Route Number"
                        />
                        {errors.routerNumber && <p className="text-red-500 text-xs mt-1">{errors.routerNumber.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Authorization Number</label>
                        <input
                            {...register('authorizationNumber', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.authorizationNumber ? 'border-red-500' : '')}
                            placeholder="Authorization Number"
                        />
                        {errors.authorizationNumber && <p className="text-red-500 text-xs mt-1">{errors.authorizationNumber.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Part Number</label>
                        <input
                            {...register('partNumber', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.partNumber ? 'border-red-500' : '')}
                            placeholder="Part Number"
                        />
                        {errors.partNumber && <p className="text-red-500 text-xs mt-1">{errors.partNumber.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Engineering Change</label>
                        <input
                            {...register('engChange', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.engChange ? 'border-red-500' : '')}
                            placeholder="Engineering Change"
                        />
                        {errors.engChange && <p className="text-red-500 text-xs mt-1">{errors.engChange.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Number of Units Shipped</label>
                        <input
                            type="number"
                            {...register('quantity', {
                                required: 'Field Required',
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: 'Quantity must be greater than 0'
                                }
                            })}
                            className={classNames(inputClasses, errors.quantity ? 'border-red-500' : '')}
                            placeholder="Number of Units Shipped"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Part Unit</label>
                        <input
                            {...register('partUnit', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.partUnit ? 'border-red-500' : '')}
                            readOnly
                            disabled
                            placeholder="Part Unit"
                        />
                        {errors.partUnit && <p className="text-red-500 text-xs mt-1">{errors.partUnit.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Delivery Order Number</label>
                        <input
                            {...register('devOrderNumber', {
                                required: 'Field Required'
                            })}
                            className={classNames(inputClasses, errors.devOrderNumber ? 'border-red-500' : '')}
                            placeholder="Delivery Order Number"
                        />
                        {errors.devOrderNumber && <p className="text-red-500 text-xs mt-1">{errors.devOrderNumber.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => saveData()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Enviar ASN
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ASNForm;