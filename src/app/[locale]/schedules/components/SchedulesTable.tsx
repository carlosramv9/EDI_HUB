'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import { formatDate } from '@/helpers/dateHelper';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';
import { useAppSelector } from '@/app/store';
import Loader from '@/components/ui/Loader';
import classNames from 'classnames';
import PaginationSimple from '@/components/shared/PaginationSimple';
import TableProvider, { TableContextProps, useTable, useTableContext } from '@/providers/TableProvider';
import ScheduleUploadModal from './ScheduleUploadModal';
import ScheduleContextMenu from './ScheduleContextMenu';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IOrder } from '@/interfaces/orders/IOrder';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/shared/DatePickerRange';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import WithPermissions from '@/components/shared/WithPermissions';
import { SMOrders } from '@/interfaces/searchModel/SearchModels';
import { useFilter } from '@/providers/filters/FilterProvider';

const SchedulesTable = () => {
    const searchModel = useAppSelector((state) => state.filters.schedules) as SMOrders;
    const orders = useAppSelector((state) => state.orders.list);
    const total = useAppSelector((state) => state.orders.total);
    const loading = useAppSelector((state) => state.orders.loading);
    const { getOrdersList, setOpenMenuId } = useOrders();
    
    // Inicializar desde el slice si existe, sino usar valores por defecto
    const [search, setSearch] = useState(searchModel?.search || '');
    const [date, setDate] = useState<DateRange | undefined>(() => {
        if (searchModel?.startDate && searchModel?.endDate) {
            return {
                from: dayjs(searchModel.startDate).toDate(),
                to: dayjs(searchModel.endDate).toDate()
            };
        }
        return {
            from: dayjs().startOf('week').toDate(),
            to: dayjs().endOf('week').toDate()
        };
    });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();
    const { setViewTitle } = useConfiguration();
    const { setFilters } = useFilter();

    // Efecto para la carga inicial - solo se ejecuta una vez
    useEffect(() => {
        if (searchModel) {
            getOrdersList(searchModel);
        }
    }, [searchModel]);

    // Sincronizar estados locales cuando cambie el searchModel desde el slice
    useEffect(() => {
        if (searchModel) {
            if (searchModel.search !== undefined && searchModel.search !== search) {
                setSearch(searchModel.search);
            }
            if (searchModel.startDate && searchModel.endDate) {
                const newDate = {
                    from: dayjs(searchModel.startDate).toDate(),
                    to: dayjs(searchModel.endDate).toDate()
                };
                if (JSON.stringify(newDate) !== JSON.stringify(date)) {
                    setDate(newDate);
                }
            }
        }
    }, [searchModel]);

    useEffect(() => {
        // Solo ejecutar si ya se hizo la carga inicial y hay cambios en los filtros
        if ((search || date)) {
            const timer = setTimeout(() => {
                var sm = {
                    ...searchModel,
                    orderColumn: 'id',
                    orderDirection: 'desc',
                    page: 1, // Resetear a página 1 cuando cambien los filtros
                    search: search,
                    startDate: date?.from ? dayjs(date.from).format('YYYY-MM-DD') : undefined,
                    endDate: date?.to ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
                    active: true,
                    onlyPending: true
                };
                setFilters('schedules', sm);
                // Hacer la consulta inmediatamente después de actualizar los filtros
                // getOrdersList(sm);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search, date]);

    useEffect(() => {
        // Solo inicializar si no hay filtros guardados en el slice
        if (!searchModel || Object.keys(searchModel).length === 0) {
            const sm: SMOrders = {
                orderColumn: 'id',
                orderDirection: 'desc',
                page: 1,
                pageSize: 10,
                startDate: date?.from ? dayjs(date.from).format('YYYY-MM-DD') : undefined,
                endDate: date?.to ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
                active: true,
                onlyPending: true
            }
            setFilters('schedules', sm);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        setViewTitle(t('scheduleTitle'));

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const setSearchModel = (sm: SMOrders) => {
        setFilters('schedules', sm);
        // Hacer la consulta para cambios de paginación
        getOrdersList(sm);
    }

    return (
        <TableProvider>
            <section className="flex flex-col gap-3">
                <Card>
                    <CardContent className="flex justify-between items-center px-5 py-2">
                        <div className="flex gap-3 items-center flex-wrap">
                            <WithPermissions permissions={['Proveedor', 'Administrador']}>
                                <ScheduleUploadModal buttonClassName="px-3 py-2 rounded-md flex gap-2 items-center hover:cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white text-sm" />
                            </WithPermissions>
                            <Input type="text" className="w-64" placeholder="Buscar (Orden, ASN, Parte, etc.)..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <DatePickerWithRange date={date} setDate={setDate} />
                            <div className="ml-auto">
                                <PaginationSimple pageSize={10} searchModel={searchModel ?? {}} setSearchModel={setSearchModel} totalRecords={total} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {loading ? <Loader /> : (
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <WithPermissions permissions={['Trafico', 'Administrador']}>
                                            <TableHead></TableHead>
                                        </WithPermissions>
                                        <TableHead>{t('orderType')}</TableHead>
                                        <TableHead>{t('shipDate')}</TableHead>
                                        <TableHead>{t('orderNumber')}</TableHead>
                                        <TableHead>{t('partNumber')}</TableHead>
                                        <TableHead>{t('partName')}</TableHead>
                                        <TableHead>{t('asnNumber')}</TableHead>
                                        <TableHead>{t('quantity')}</TableHead>
                                        <TableHead>{t('shipTo')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders?.map((order: IOrder, index: number) => (
                                        <TableRow
                                            key={order.id}
                                        >
                                            <WithPermissions permissions={['Trafico', 'Administrador']}>
                                                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white relative">
                                                    <ScheduleContextMenu order={order} buttonRef={buttonRef} menuRef={menuRef} />
                                                </TableCell>
                                            </WithPermissions>
                                            <TableCell>{order.type}</TableCell>
                                            <TableCell>{formatDate(order.shipDate || '')}</TableCell>
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.partNumber}</TableCell>
                                            <TableCell>{order.partName}</TableCell>
                                            <TableCell>{order.asnNumber}</TableCell>
                                            <TableCell>{order.quantity}</TableCell>
                                            <TableCell>{order.shipTo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </section>
        </TableProvider >
    )
}

export default SchedulesTable