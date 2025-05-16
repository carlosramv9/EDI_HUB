import { useRouter } from '@/navigation';
import { useOrders } from '@/providers/orders/OrdersProvider';
import { MoreVertical } from 'lucide-react';
import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl';

const ScheduleContextMenu = ({ order, buttonRef, menuRef }: any) => {
    const t = useTranslations();
    const router = useRouter();
    const { setOpenMenuId, openMenuId, downloadASNFile } = useOrders();

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
            case 'packaging-requirements':
                router.push(`/schedules/${id}/packaging-requirements`);
                break;
            case 'generate-asn':
                downloadASNFile();
                break;
            case 'manifest':
                router.push(`/schedules/${id}/manifest`);
                break;
            default:
                break;
        }
        setOpenMenuId(null);
    }, []);

    const toggleMenu = useCallback((id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }, [openMenuId]);

    return (
        <div>
            <button
                ref={openMenuId === order.id ? buttonRef : null}
                onClick={() => order.id && toggleMenu(order.id)}
                className="p-1 rounded-full"
            >
                <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {openMenuId === order.id && (
                <div
                    ref={menuRef}
                    className="absolute left-5 mt-2 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                    <div className="py-1 flex flex-col" role="menu">
                        {/* <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('edit', order.id!)}
                        >
                            {t('edit')}
                        </button> */}
                        <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('manifest', order.id!)}
                        >
                            {t('printManifest')}
                        </button>
                        {/* <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('skid-manifest', order.id!)}
                        >
                            {t('printSkidManifest')}
                        </button> */}
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
                            onClick={() => handleAction('packaging-requirements', order.id!)}
                        >
                            {t('printPackaging')}
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('generate-asn', order.id!)}
                        >
                            {t('generateASN')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScheduleContextMenu