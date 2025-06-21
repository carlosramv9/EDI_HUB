'use client'

import { useAppDispatch } from "@/app/store";
import { BaseService } from "@/services/api/BaseService";
import { apiASN } from "@/services/api/subaru/ASNApi";
import { AxiosResponse } from "axios";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface IAdvanceShippingNoticeProps {
    children: React.ReactNode;
}

interface IAdvanceShippingNoticeContext {
    register: UseFormRegister<IAdvanceShippingNotice>;
    handleSubmit: UseFormHandleSubmit<IAdvanceShippingNotice>;
    errors: FieldErrors<IAdvanceShippingNotice>;
    setValue: UseFormSetValue<IAdvanceShippingNotice>;
    getValues: UseFormGetValues<IAdvanceShippingNotice>;
    getByOrderId: (id: number) => Promise<any>;
    send: (data: IAdvanceShippingNotice) => Promise<any>;
    advanceShippingNotice: IAdvanceShippingNotice | null;
    setAdvanceShippingNotice: React.Dispatch<React.SetStateAction<IAdvanceShippingNotice | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    save: (data: IAdvanceShippingNotice) => Promise<any>;
    update: (data: IAdvanceShippingNotice) => Promise<any>;
    download: (data: IAdvanceShippingNotice) => Promise<any>;
}

const ASNContext = React.createContext<IAdvanceShippingNoticeContext | null>(null);

const ASNProvider = ({ children }: IAdvanceShippingNoticeProps) => {
    const dispatch = useAppDispatch();
    const api = new BaseService('AdvanceShippingNotice');

    const [loading, setLoading] = useState(false);
    const [advanceShippingNotice, setAdvanceShippingNotice] = useState<IAdvanceShippingNotice | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<IAdvanceShippingNotice>({
        mode: 'onBlur',
    });

    const getByOrderId = async (id: number) => {
        try {
            const response = await api.get<IAdvanceShippingNotice>({ endpoint: `order/${id}`, });
            setAdvanceShippingNotice(response);
            return response;
        } catch (error) {
            console.error('Error fetching ASN by order ID:', error);
            throw error;
        }
    };

    const save = async (data: IAdvanceShippingNotice) => {
        try {
            setLoading(true);
            const confirmation = await Swal.fire({
                title: 'Save ASN',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            });

            if (!confirmation.isConfirmed) {
                return;
            }

            await api.post({ data });
            toast.success('ASN saved successfully');
        } catch (error) {
            console.error('Error saving ASN:', error);
            toast.error('Error saving ASN');
        } finally {
            setLoading(false);
        }
    };

    const update = async (data: IAdvanceShippingNotice) => {
        try {
            setLoading(true);
            const confirmation = await Swal.fire({
                title: 'Update ASN',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            });

            if (!confirmation.isConfirmed) {
                return;
            }

            await api.update({ data });
            toast.success('ASN updated successfully');
        } catch (error) {
            console.error('Error updating ASN:', error);
            toast.error('Error updating ASN');
        } finally {
            setLoading(false);
        }
    };

    const send = async (data: IAdvanceShippingNotice) => {
        try {
            setLoading(true);
            const confirmation = await Swal.fire({
                title: 'Send ASN',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            });

            if (!confirmation.isConfirmed) {
                return;
            }

            await api.post({ data, endpoint: 'generate' });
            await download(data);
            toast.success('ASN sent successfully');
            setLoading(false);
        } catch (error) {
            console.error('Error sending ASN:', error);
            toast.error('Error sending ASN');
        } finally {
            setLoading(false);
        }
    };

    const download = async (data: IAdvanceShippingNotice) => {
        try {
            // const response = await api.post<AxiosResponse<Blob>>({ endpoint: 'download', data, isBlob: true });
            const response = await apiASN.downloadASN({
                endpoint: 'download', data
            });

            const contentDisposition = response?.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'asn.edi';

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
            const link = document.createElement('a');
            link.href = url;
            // link.setAttribute('download', fileName);
            link.download = fileName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            // return response;
        } catch (error) {
            console.error('Error downloading ASN:', error);
        }
    }

    const value = useMemo(() => ({
        register,
        handleSubmit,
        errors,
        setValue,
        getValues,
        getByOrderId,
        send,
        advanceShippingNotice,
        setAdvanceShippingNotice,
        loading,
        setLoading,
        save,
        update,
        download
    }), [errors, advanceShippingNotice, loading, setLoading, setAdvanceShippingNotice, getValues, getByOrderId, send, save, update, download]);

    return (
        <ASNContext.Provider value={value}>
            {children}
        </ASNContext.Provider>
    );
};

export const useASN = () => {
    const context = React.useContext(ASNContext);
    if (!context) {
        throw new Error('useASN must be used within an ASNProvider');
    }
    return context;
};

export default ASNProvider;
