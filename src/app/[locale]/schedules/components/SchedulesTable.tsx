'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '@/helpers/dateHelper';
import { useTranslations } from 'next-intl';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';
import { useRouter } from '@/navigation';
import { useAppSelector } from '@/app/store';
import Pagination from '@/components/shared/Pagination';
import Loader from '@/components/ui/Loader';
import classNames from 'classnames';

const SchedulesTable = () => {
    const orders = useAppSelector((state) => state.orders.list);
    const loading = useAppSelector((state) => state.orders.loading);
    const { getOrdersList } = useOrders();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();
    const { setViewTitle } = useConfiguration();
    const router = useRouter();

    useEffect(() => {
        getOrdersList();
        setViewTitle(t('scheduleTitle'));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = useCallback((id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }, [openMenuId]);

    const handleAction = useCallback((action: string, id: number) => {
        switch (action) {
            case 'edit':
                router.push(`/schedules/${id}`);
                break;
            case 'skid-manifest':
                router.push(`/schedules/${id}/skid-manifest`);
                break;
            case 'production-parts':
                router.push(`/schedules/${id}/production-parts`);
                break;
            case 'pallet-master':
                router.push(`/schedules/${id}/pallet-master`);
                break;
            case 'packaging':
                router.push(`/schedules/${id}/packaging`);
                break;
            case 'generate-asn':
                router.push(`/schedules/${id}/generate-asn`);
                break;
            default:
                break;
        }
        setOpenMenuId(null);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="rounded-lg px-5 mb-10 overflow-auto">            
            {/* <h2 className='text-2xl font-bold m-3 mb-5'>{t('scheduleTitle')}</h2> */}
            <section>

            </section>
            <table className={classNames(
                "min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden",
                'dark:divide-gray-200 dark:border-gray-200 dark:bg-gray-500'
            )}>
                <thead className="">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('orderType')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('asnNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('orderNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('partNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('partName')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('shipDate')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('quantity')}</th>
                        <th className="px-6 py-3 text-left text-xs text-nowrap font-medium text-gray-500 uppercase tracking-wider dark:text-white">{t('shipTo')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-200">
                    {orders?.map((order, index) => (
                        <tr
                            key={order.id}
                            className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-500' : 'bg-gray-50 dark:bg-gray-600'} hover:bg-[#bcc9d6] dark:hover:bg-[#2C3E50] dark:hover:text-white transition-colors`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white relative">
                                <button
                                    ref={openMenuId === order.id ? buttonRef : null}
                                    onClick={() => order.id && toggleMenu(order.id)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                                {openMenuId === order.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute left-5 mt-2 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10"
                                    >
                                        <div className="py-1 flex flex-col" role="menu">
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('edit', order.id!)}
                                            >
                                                {t('edit')}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('skid-manifest', order.id!)}
                                            >
                                                {t('printSkidManifest')}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('production-parts', order.id!)}
                                            >
                                                {t('printProductionParts')}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('pallet-master', order.id!)}
                                            >
                                                {t('printPalletMaster')}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('packaging', order.id!)}
                                            >
                                                {t('printPackaging')}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                                onClick={() => handleAction('packaging', order.id!)}
                                            >
                                                {t('generateASN')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.asnNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{order.partNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{order.partName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{formatDate(order.shipDate || '')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{order.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">{order.shipTo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <Pagination /> */}
        </div>
    )
}

export default SchedulesTable