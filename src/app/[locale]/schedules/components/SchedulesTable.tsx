'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '@/helpers/dateHelper';
import { useTranslations } from 'next-intl';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';

const SchedulesTable = () => {
    const { orders, getOrders } = useOrders();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();
    const { setViewTitle } = useConfiguration();

    useEffect(() => {
        getOrders();
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
        console.log(action, id);
        setOpenMenuId(null);
    }, []);

    return (
        <div className="overflow-x-auto rounded-lg px-5 mb-10">
            <Breadcrumb />
            {/* <h2 className='text-2xl font-bold m-3 mb-5'>{t('scheduleTitle')}</h2> */}
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('partNumber')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('partName')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('shipDate')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('shipTo')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders?.map((order, index) => (
                        <tr
                            key={order.id}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.partNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.partName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.shipDate || '')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shipTo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SchedulesTable