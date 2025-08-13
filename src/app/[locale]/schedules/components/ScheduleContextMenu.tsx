import { useRouter } from '@/navigation';
import { useOrders } from '@/providers/orders/OrdersProvider';
import { MoreVertical } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl';
import WithPermissions from './../../../../components/shared/WithPermissions';
import { createPortal } from 'react-dom';

const ScheduleContextMenu = ({ order, buttonRef, menuRef }: any) => {
    const t = useTranslations();
    const router = useRouter();
    const { setOpenMenuId, openMenuId, cancelOrder } = useOrders();
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                // downloadASNFile();
                router.push(`/schedules/${id}/generate`);
                break;
            case 'manifest':
                router.push(`/schedules/${id}/manifest`);
                break;
            case 'special-rack':
                router.push(`/schedules/${id}/special-rack`);
                break;
            default:
                break;
        }
        setOpenMenuId(null);
    }, []);

    const toggleMenu = useCallback((id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }, [openMenuId]);

    // Calculate menu position when it opens
    useEffect(() => {
        if (openMenuId === order.id && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let top = buttonRect.bottom + 5;
            let left = buttonRect.left;
            
            // Adjust if menu would go off-screen
            if (left + 250 > viewportWidth) {
                left = buttonRect.right - 250;
            }
            
            if (top + 300 > viewportHeight) {
                top = buttonRect.top - 300;
            }
            
            setMenuPosition({ top, left });
        }
    }, [openMenuId, order.id, buttonRef]);

    const menu = openMenuId === order.id && mounted ? (
        <div
            ref={menuRef}
            className="fixed rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-[9999] min-w-[200px]"
            style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`
            }}
        >
            <div className="py-1 flex flex-col" role="menu">
                {/* <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('edit', order.id!)}
                >
                    {t('edit')}
                </button> */}
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('manifest', order.id!)}
                >
                    {t('printManifest')}
                </button>
                {/* <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('skid-manifest', order.id!)}
                >
                    {t('printSkidManifest')}
                </button> */}
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('production-parts', order.id!)}
                >
                    {t('printProductionParts')}
                </button>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('pallet-master', order.id!)}
                >
                    {t('printPalletMaster')}
                </button>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('packaging-requirements', order.id!)}
                >
                    {t('printPackaging')}
                </button>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('special-rack', order.id!)}
                >
                    {t('generateSpecialRack')}
                </button>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('generate-asn', order.id!)}
                >
                    {t('generateASN')}
                </button>
                <WithPermissions permissions={['Administrador']}>
                    <button
                        className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 text-left whitespace-nowrap"
                        onClick={() => cancelOrder(order.id!)}
                    >
                        {t('cancelOrder')}
                    </button>
                </WithPermissions>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                ref={openMenuId === order.id ? buttonRef : null}
                onClick={() => order.id && toggleMenu(order.id)}
                className="p-1 rounded-full hover:bg-gray-100"
            >
                <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {mounted && menu && createPortal(menu, document.body)}
        </>
    )
}

export default ScheduleContextMenu