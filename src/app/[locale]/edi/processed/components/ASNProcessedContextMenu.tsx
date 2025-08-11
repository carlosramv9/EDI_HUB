import { useASNProcessed } from '@/providers/asn/ASNProcessedProvider';
import { MoreVertical } from 'lucide-react';
import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl';
import WithPermissions from '@/components/shared/WithPermissions';
import { IASNProcessed } from '@/interfaces/asn/IASNProcessed';

interface ASNProcessedContextMenuProps {
    asn: IASNProcessed;
    buttonRef: React.RefObject<HTMLButtonElement>;
    menuRef: React.RefObject<HTMLDivElement>;
}

const ASNProcessedContextMenu = ({ asn, buttonRef, menuRef }: ASNProcessedContextMenuProps) => {
    const t = useTranslations();
    const { setOpenMenuId, openMenuId, downloadASN } = useASNProcessed();

    const handleAction = useCallback((action: string, asnData: IASNProcessed) => {
        switch (action) {
            case 'download':
                downloadASN(asnData);
                break;
            case 'view':
                // Aquí podrías implementar una vista detallada del ASN
                console.log('Ver detalles del ASN:', asnData);
                break;
            default:
                break;
        }
        setOpenMenuId(null);
    }, [downloadASN, setOpenMenuId]);

    const toggleMenu = useCallback((id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }, [openMenuId, setOpenMenuId]);

    return (
        <div>
            <button
                ref={openMenuId === asn.id ? buttonRef : null}
                onClick={() => asn.id && toggleMenu(asn.id)}
                className="p-1 rounded-full"
            >
                <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {openMenuId === asn.id && (
                <div
                    ref={menuRef}
                    className="absolute left-5 mt-2 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                    <div className="py-1 flex flex-col" role="menu">
                        <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('download', asn)}
                        >
                            {t('downloadASN')}
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleAction('view', asn)}
                        >
                            {t('viewDetails')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ASNProcessedContextMenu
