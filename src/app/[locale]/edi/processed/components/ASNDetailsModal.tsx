'use client'

import React from 'react';
import { useTranslations } from 'next-intl';
import { IASNProcessed } from '@/interfaces/asn/IASNProcessed';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/Button';
import { StatusSend } from '@/types/enums/StatusSend';

interface ASNDetailsModalProps {
    asn: IASNProcessed;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ASNDetailsModal = ({ asn, open, onOpenChange }: ASNDetailsModalProps) => {
    const t = useTranslations();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('asnDetails')}</DialogTitle>
                    <DialogDescription>
                        {t('asnDetailsDescription', { asnNumber: asn.asnNumber || 'N/A' })}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    {/* Basic Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                            {t('basicInformation')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('asnNumber')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.asnNumber || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('orderNumber')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.devOrderNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('dateProcessed')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.dateProcessed ? new Date(asn.dateProcessed).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('typeSend')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.typeSendName || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('createdBy')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.createdBy || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('status')}
                                </label>
                                <p className={`text-sm p-2 rounded ${asn.statusSend == StatusSend.Sent 
                                    ? 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900' 
                                    : 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900'
                                }`}>
                                    {t(StatusSend[asn.statusSend!])}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                            {t('shippingInformation')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('scacCode')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.scacCode || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('carrier')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.carrier || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('billOfLanding')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.billOfLanding || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('packingList')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.packingList || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('carrierRef')}
                            </label>
                            <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                {asn.carrierRef || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Part Information */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-2">
                            {t('partInformation')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('partNumber')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.partNumber || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Eng Change
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.engChange || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('quantity')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.quantity || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('partUnit')}
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.partUnit || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Line Count
                                </label>
                                <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    {asn.lineCount || 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dev Order Number
                            </label>
                            <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                {asn.devOrderNumber || 'N/A'}
                            </p>
                        </div>
                    </div>
                    
                    {asn.stringASN && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('asnContent')}
                            </label>
                            <div className="text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded max-h-48 overflow-auto font-mono w-full">
                                <pre className="whitespace-pre-wrap break-words break-all overflow-wrap-anywhere">
                                    {asn.stringASN}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t('close')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ASNDetailsModal;
