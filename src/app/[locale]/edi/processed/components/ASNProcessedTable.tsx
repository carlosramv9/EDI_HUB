'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useASNProcessed } from '@/providers/asn/ASNProcessedProvider';
import { formatDate } from '@/helpers/dateHelper';
import { useTranslations } from 'next-intl';
import { useConfiguration } from '@/providers/configuration/ConfigurationProvider';
import Loader from '@/components/ui/Loader';
import PaginationSimple from '@/components/shared/PaginationSimple';
import TableProvider from '@/providers/TableProvider';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IASNProcessed } from '@/interfaces/asn/IASNProcessed';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/shared/DatePickerRange';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import WithPermissions from '@/components/shared/WithPermissions';
import { SMASNProcessed } from '@/interfaces/searchModel/SearchModels';
import ASNProcessedContextMenu from './ASNProcessedContextMenu';

const ASNProcessedTable = () => {
    const { asnProcessed, getASNProcessed, setOpenMenuId, setSearchModel, searchModel, total } = useASNProcessed();
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<DateRange | undefined>({
        from: dayjs().startOf('month').toDate(),
        to: dayjs().endOf('month').toDate()
    });
    const [loading, setLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations();
    const { setViewTitle } = useConfiguration();

    useEffect(() => {
        if (searchModel) {
            setLoading(true);
            getASNProcessed(searchModel).finally(() => setLoading(false));
        }
    }, [searchModel]);

    useEffect(() => {
        if (search || date) {
            const timer = setTimeout(() => {
                var sm = {
                    ...searchModel,
                    orderColumn: 'id',
                    orderDirection: 'desc',
                    search: search,
                    startDate: date?.from ? dayjs(date.from).format('YYYY-MM-DD') : undefined,
                    endDate: date?.to ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
                    active: true
                };
                setSearchModel(sm);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [search, date]);

    useEffect(() => {
        const sm: SMASNProcessed = {
            orderColumn: 'id',
            orderDirection: 'desc',
            page: 1,
            pageSize: 10,
            startDate: date?.from ? dayjs(date.from).format('YYYY-MM-DD') : undefined,
            endDate: date?.to ? dayjs(date.to).format('YYYY-MM-DD') : undefined,
            active: true
        }
        setSearchModel(sm);

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        setViewTitle(t('asnProcessedTitle'));

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <TableProvider>
            <section className="flex flex-col gap-3">
                <Card>
                    <CardContent className="flex justify-between items-center px-5 py-2">
                        <div className="flex gap-3 items-center flex-wrap">
                            <Input type="text" className="w-64" placeholder="Buscar (ASN, Orden, etc.)..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                        <TableHead></TableHead>
                                        <TableHead>{t('asnNumber')}</TableHead>
                                        <TableHead>{t('orderNumber')}</TableHead>
                                        <TableHead>{t('dateProcessed')}</TableHead>
                                        <TableHead>{t('typeSend')}</TableHead>
                                        <TableHead>{t('statusSend')}</TableHead>
                                        <TableHead>{t('createdBy')}</TableHead>
                                        <TableHead>{t('createdAt')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(asnProcessed || [])?.map((asn: IASNProcessed, index: number) => (
                                        <TableRow
                                            key={asn.id}
                                        >
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white relative">
                                                <ASNProcessedContextMenu asn={asn} buttonRef={buttonRef} menuRef={menuRef} />
                                            </TableCell>
                                            <TableCell>{asn.asnNumber}</TableCell>
                                            <TableCell>{asn.devOrderNumber}</TableCell>
                                            <TableCell>{formatDate(asn.dateProcessed || '')}</TableCell>
                                            <TableCell>{asn.typeSendName}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${asn.statusSend === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {asn.statusSend === 1 ? 'Enviado' : 'Pendiente'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{asn.createdBy}</TableCell>
                                            <TableCell>{formatDate(asn.createdAt || '')}</TableCell>
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

export default ASNProcessedTable
