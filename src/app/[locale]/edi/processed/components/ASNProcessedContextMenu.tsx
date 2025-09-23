import { useASNProcessed } from '@/providers/asn/ASNProcessedProvider';
import { MoreVertical } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl';
import WithPermissions from '@/components/shared/WithPermissions';
import { IASNProcessed } from '@/interfaces/asn/IASNProcessed';
import { createPortal } from 'react-dom';
import ASNDetailsModal from './ASNDetailsModal';
import { useManifestContext } from '@/providers/manifest/ManifestProvider';

interface ASNProcessedContextMenuProps {
    asn: IASNProcessed;
    buttonRef: React.RefObject<HTMLButtonElement>;
    menuRef: React.RefObject<HTMLDivElement>;
}

const ASNProcessedContextMenu = ({ asn, buttonRef, menuRef }: ASNProcessedContextMenuProps) => {
    const t = useTranslations();
    const { setOpenMenuId, openMenuId, downloadASN, reactivateASN, searchModel } = useASNProcessed();
    const { downloadManifestByOrderId } = useManifestContext();
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAction = useCallback((action: string, asnData: IASNProcessed) => {
        switch (action) {
            case 'download':
                downloadASN(asnData);
                break;
            case 'view':
                setShowDetailsModal(true);
                break;
            case 'reactivate':
                reactivateASN(asnData, searchModel || {});
                break;
            case 'manifestLabel':
                downloadManifestByOrderId(asnData.orderId!);
                break;
            default:
                break;
        }
        setOpenMenuId(null);
    }, [downloadASN, reactivateASN, searchModel, setOpenMenuId]);

    const toggleMenu = useCallback((id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }, [openMenuId, setOpenMenuId]);

    // Calculate menu position when it opens
    useEffect(() => {
        if (openMenuId === asn.id && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = buttonRect.bottom + 5;
            let left = buttonRect.left;

            // Adjust if menu would go off-screen
            if (left + 200 > viewportWidth) {
                left = buttonRect.right - 200;
            }

            if (top + 100 > viewportHeight) {
                top = buttonRect.top - 100;
            }

            setMenuPosition({ top, left });
        }
    }, [openMenuId, asn.id, buttonRef]);

    const menu = openMenuId === asn.id && mounted ? (
        <div
            ref={menuRef}
            className="fixed rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-[9999] min-w-[150px]"
            style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`
            }}
        >
            <div className="py-1 flex flex-col" role="menu">
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('download', asn)}
                >
                    {t('downloadASN')}
                </button>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('manifestLabel', asn)}
                >
                    {t('printManifest')}
                </button>
                <WithPermissions permissions={['Administrador']}>
                    <button
                        className="px-4 py-2 text-sm text-green-700 hover:bg-green-100 text-left whitespace-nowrap"
                        onClick={() => handleAction('reactivate', asn)}
                    >
                        {t('re-send')}
                    </button>
                </WithPermissions>
                <button
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                    onClick={() => handleAction('view', asn)}
                >
                    {t('viewDetails')}
                </button>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                ref={openMenuId === asn.id ? buttonRef : null}
                onClick={() => asn.id && toggleMenu(asn.id)}
                className="p-1 rounded-full hover:bg-gray-100"
            >
                <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {mounted && menu && createPortal(menu, document.body)}

            {/* ASN Details Modal */}
            <ASNDetailsModal
                asn={asn}
                open={showDetailsModal}
                onOpenChange={setShowDetailsModal}
            />
        </>
    )
}

export default ASNProcessedContextMenu
