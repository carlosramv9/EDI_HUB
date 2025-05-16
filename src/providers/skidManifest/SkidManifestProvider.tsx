'use client'
import { SkidManifestLabel } from "@/interfaces/labels/ISkidManifest";
import SkidManifestApi from "@/services/api/labels/manifestApi";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface SkidManifestProviderProps {
    children: React.ReactNode;
}

interface SkidManifestContext {
    manifest: SkidManifestLabel;
    setSkidManifest: (manifest: SkidManifestLabel) => void;
    getSkidManifest: (orderId: number) => Promise<void>;
    getSkidManifestByOrderId: (orderId: number) => Promise<void>;
    createSkidManifest: (data: SkidManifestLabel) => Promise<void>;
    dowloadLabel: (data: SkidManifestLabel) => Promise<void>;
    //
    register: UseFormRegister<SkidManifestLabel>;
    handleSubmit: UseFormHandleSubmit<SkidManifestLabel>;
    errors: FieldErrors<SkidManifestLabel>;
    setValue: UseFormSetValue<SkidManifestLabel>;
}

const SkidManifestContext = React.createContext<SkidManifestContext | null>(null);

const SkidManifestProvider = ({ children }: SkidManifestProviderProps) => {
    const [manifest, setSkidManifest] = useState<SkidManifestLabel>({})
    const api = new SkidManifestApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<SkidManifestLabel>()

    const getSkidManifest = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setSkidManifest(response);
    }

    const getSkidManifestByOrderId = async (orderId: number) => {
        const response = await api.get<SkidManifestLabel>({ endpoint: `order/${orderId}` });
        setSkidManifest({ ...response, id: 0 });
    }

    const createSkidManifest = async (data: SkidManifestLabel) => {
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

            await api.post({ data });
            const response = await api.get<SkidManifestLabel>({ endpoint: `order/${data.orderId}` });
            setSkidManifest({ ...response, id: 0 });

            toast.success('Skid Manifest created successfully');
        } catch (error) {
            toast.error('Error creating Skid Manifest');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: SkidManifestLabel) => {
        try {
            //await createMasterPallet(data);
            const response = await apiSubaru.downloadLabel({
                endpoint: 'SkidManifestLabel', data
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

    const value = useMemo(() => ({
        manifest,
        setSkidManifest,
        getSkidManifest,
        getSkidManifestByOrderId,
        createSkidManifest,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue
    }), [manifest])

    return (
        <SkidManifestContext.Provider value={value}>
            {children}
        </SkidManifestContext.Provider>
    );
};

export const useSkidManifestContext = () => {
    const context = React.useContext(SkidManifestContext);
    if (!context) {
        throw new Error('useSkidManifestContext must be used within a SkidManifestProvider');
    }
    return context;
};

export default SkidManifestProvider;
