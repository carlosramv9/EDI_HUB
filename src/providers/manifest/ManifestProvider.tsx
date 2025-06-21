'use client'
import { ManifestLabel } from "@/interfaces/labels/IManifest";
import ManifestApi from "@/services/api/labels/manifestApi";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface ManifestProviderProps {
    children: React.ReactNode;
}

interface ManifestContext {
    manifest: ManifestLabel;
    setManifest: (manifest: ManifestLabel) => void;
    getManifest: (orderId: number) => Promise<void>;
    getManifestByOrderId: (orderId: number) => Promise<void>;
    createManifest: (data: ManifestLabel) => Promise<void>;
    dowloadLabel: (data: ManifestLabel) => Promise<void>;
    //
    register: UseFormRegister<ManifestLabel>;
    handleSubmit: UseFormHandleSubmit<ManifestLabel>;
    errors: FieldErrors<ManifestLabel>;
    setValue: UseFormSetValue<ManifestLabel>;
    clearRegister: () => void;
    getValues: UseFormGetValues<ManifestLabel>;
}

const ManifestContext = React.createContext<ManifestContext | null>(null);

const ManifestProvider = ({ children }: ManifestProviderProps) => {
    const [manifest, setManifest] = useState<ManifestLabel>({})
    const api = new ManifestApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm<ManifestLabel>()

    const getManifest = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setManifest(response);
    }

    const getManifestByOrderId = async (orderId: number) => {
        const response = await api.get<ManifestLabel>({ endpoint: `order/${orderId}` });
        setManifest({ ...response, id: 0 });
    }

    const createManifest = async (data: ManifestLabel) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Create a Label',
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

            // console.log(data);
            await api.post({ data });
            const response = await api.get<ManifestLabel>({ endpoint: `order/${data.orderId}` });
            setManifest({ ...response, id: 0 });

            toast.success('Pallet Master created successfully');
        } catch (error) {
            toast.error('Error creating Pallet Master');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: ManifestLabel) => {
        try {
            await createManifest(data);
            const response = await apiSubaru.downloadLabel({
                endpoint: 'ManifestLabel', data
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'manifest-label.pdf';

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            toast.error('Error downloading Pallet Master');
            console.log(error);
        }
    }

    const clearRegister = () => {
        setValue('partNumber', '');
        setValue('doNumber', '');
        setValue('partName', '');
        setValue('supplierUse', 'A361-01');
        setValue('shipDate', '');
        setValue('ecsNumber', '');
        setValue('quantity', 1);
        setValue('lineDeliveryCode', '');
        setValue('quantityRack', 1);
        setValue('kanban', '');
        setValue('whLoc', '');
        setValue('orderCode', '');
        setValue('fitLoc', '');
        setValue('deliveryCode', '');
        setValue('purchaseOrderNumber', '');
        setValue('mfgDate', dayjs().format('YYYY-MM-DD'));
        setValue('snp', '');
    }

    const value = useMemo(() => ({
        manifest,
        setManifest,
        getManifest,
        getManifestByOrderId,
        createManifest,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue,
        clearRegister,
        getValues
    }), [manifest])

    return (
        <ManifestContext.Provider value={value}>
            {children}
        </ManifestContext.Provider>
    );
};

export const useManifestContext = () => {
    const context = React.useContext(ManifestContext);
    if (!context) {
        throw new Error('useManifestContext must be used within a ManifestProvider');
    }
    return context;
};

export default ManifestProvider;
