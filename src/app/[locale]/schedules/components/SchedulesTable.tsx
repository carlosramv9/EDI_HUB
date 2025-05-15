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
import PaginationSimple from '@/components/shared/PaginationSimple';
import TableProvider, { useTable } from '@/providers/TableProvider';
import { useScheduleContext } from '@/providers/schedules/ScheduleProvider';
import ScheduleUploadModal from './ScheduleUploadModal';
import ScheduleContextMenu from './ScheduleContextMenu';

const SchedulesTable = () => {
    const orders = useAppSelector((state) => state.orders.list);
    const total = useAppSelector((state) => state.orders.total);
    const loading = useAppSelector((state) => state.orders.loading);
    const { getOrdersList, setOpenMenuId } = useOrders();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();
    const { setViewTitle } = useConfiguration();


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

    const tableValue = useTable({
        data: orders,
        pageSize: 10,
        total: total,
        totalPages: Math.ceil(total / 10)
    });

    if (loading) {
        return <Loader />;
    }

    return (
        <TableProvider {...tableValue}>
            <section className="flex justify-between items-center px-5 py-2">
                <ScheduleUploadModal buttonClassName="px-3 py-2 rounded-md flex gap-2 items-center hover:cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white text-sm" />
                <PaginationSimple />
            </section>
            <div className="rounded-lg px-5 mb-10 overflow-auto">
                {/* <h2 className='text-2xl font-bold m-3 mb-5'>{t('scheduleTitle')}</h2> */}
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
                                className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-500' : 'bg-gray-50 dark:bg-gray-600'} hover:bg-[#c3cbd4] dark:hover:bg-[#2C3E50] dark:hover:text-white transition-colors`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white relative">
                                    <ScheduleContextMenu order={order} buttonRef={buttonRef} menuRef={menuRef} />
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
        </TableProvider>
    )
}

export default SchedulesTable