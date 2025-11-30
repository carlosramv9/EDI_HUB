'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useOrders } from '@/providers/orders/OrdersProvider';
import { formatDate } from '@/helpers/dateHelper';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';
import { useAppSelector, useAppDispatch } from '@/app/store';
import Loader from '@/components/ui/Loader';
import PaginationSimple from '@/components/shared/PaginationSimple';
import TableProvider, { TableContextProps, useTable, useTableContext } from '@/providers/TableProvider';
import ScheduleUploadModal from './ScheduleUploadModal';
import ScheduleContextMenu from './ScheduleContextMenu';
import { useRouter } from '@/navigation';
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
import { toggleOrderSelection, selectAllOrders, clearSelectedOrders } from '@/store/features/selectedOrders/selectedOrdersSlice';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify';

const SchedulesTable = () => {
    const dispatch = useAppDispatch();
    const searchModel = useAppSelector((state) => state.filters.schedules) as SMOrders;
    const orders = useAppSelector((state) => state.orders.list);
    const total = useAppSelector((state) => state.orders.total);
    const loading = useAppSelector((state) => state.orders.loading);
    const selectedOrders = useAppSelector((state) => state.selectedOrders.selectedOrders);
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
    const router = useRouter();
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

    const handleOrderSelection = (order: IOrder) => {
        dispatch(toggleOrderSelection(order));
    };

    const isOrderSelected = (orderId?: number) => {
        return selectedOrders.some(order => order.id === orderId);
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            dispatch(clearSelectedOrders());
        } else {
            dispatch(selectAllOrders(orders));
        }
    };

    const allSelected = orders.length > 0 && selectedOrders.length === orders.length;
    const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length;

    const handleCreateShipment = () => {
        if (selectedOrders.length >= 1) {
            router.push('/schedules/create-shipment');
        }
    };

    // Función para sugerir órdenes del día actual
    const handleSuggestTodayOrders = () => {
        const today = dayjs().format('YYYY-MM-DD');
        const todayOrders = orders.filter(order => {
            if (!order.shipDate) return false;
            const orderDate = dayjs(order.shipDate).format('YYYY-MM-DD');
            return orderDate === today;
        });

        if (todayOrders.length < 1) {
            toast.warning(t('noOrdersToday') || 'No hay órdenes del día actual para crear un envío');
            return;
        }

        // Seleccionar todas las órdenes del día actual
        dispatch(selectAllOrders(todayOrders));
        toast.success(`${todayOrders.length} ${todayOrders.length === 1 ? 'orden' : 'órdenes'} del día actual seleccionada${todayOrders.length === 1 ? '' : 's'}`);
    };

    return (
        <TableProvider>
            <section className="flex flex-col gap-3">
                <Card>
                    <CardContent className="flex justify-between items-center px-5 py-2">
                        <div className="flex gap-3 items-center flex-wrap">
                            <WithPermissions permissions={['Proveedor', 'Administrador']}>
                                <ScheduleUploadModal buttonClassName="px-3 py-2 rounded-md flex gap-2 items-center hover:cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white text-sm" />
                            </WithPermissions>
                            <Button
                                onClick={handleSuggestTodayOrders}
                                className="px-3 py-2 rounded-md flex gap-2 items-center hover:cursor-pointer bg-purple-500 hover:bg-purple-600 text-white text-sm transition-colors"
                                title="Seleccionar órdenes del día actual"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                {t('suggestTodayOrders') || 'Sugerir Órdenes de Hoy'}
                            </Button>
                            <Input type="text" className="w-64" placeholder="Buscar (Orden, ASN, Parte, etc.)..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <DatePickerWithRange date={date} setDate={setDate} />
                            <div className="ml-auto">
                                <PaginationSimple pageSize={10} searchModel={searchModel ?? {}} setSearchModel={setSearchModel} totalRecords={total} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {selectedOrders.length > 0 && (
                    <Card>
                        <CardContent className="px-5 py-2">
                            <div className="flex items-center justify-between">
                                <div className="px-3 py-2 rounded-md flex gap-2 items-center text-sm">
                                    <span>{t('selectedOrders') || 'Órdenes seleccionadas'}:</span>
                                    <span className="bg-white text-green-600 rounded-full px-2 py-0.5 font-semibold">
                                        {selectedOrders.length}
                                    </span>
                                </div>
                                {selectedOrders.length >= 1 && (
                                    <Button
                                        onClick={handleCreateShipment}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {t('createShipment') || 'Crear Envío'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
                {loading ? <Loader /> : (
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={allSelected}
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Seleccionar todas"
                                                className={someSelected ? "data-[state=checked]:bg-blue-500" : ""}
                                            />
                                        </TableHead>
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
                                            className={isOrderSelected(order.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                                        >
                                            <TableCell className="w-12">
                                                <Checkbox
                                                    checked={isOrderSelected(order.id)}
                                                    onCheckedChange={() => handleOrderSelection(order)}
                                                    aria-label={`Seleccionar orden ${order.orderNumber}`}
                                                />
                                            </TableCell>
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