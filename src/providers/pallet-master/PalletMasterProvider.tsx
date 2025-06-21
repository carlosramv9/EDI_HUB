'use client'
import { PalletMasterLabel } from "@/interfaces/labels/IPalletMaster";
import PalletMasterApi from "@/services/api/labels/palletMasterApi";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface PalletMasterProviderProps {
    children: React.ReactNode;
}

interface PalletMasterContext {
    palletMaster: PalletMasterLabel;
    setPalletMaster: (palletMaster: PalletMasterLabel) => void;
    getPalletMaster: (orderId: number) => Promise<void>;
    getPalletMasterByOrderId: (orderId: number) => Promise<void>;
    createMasterPallet: (data: PalletMasterLabel) => Promise<void>;
    dowloadLabel: (data: PalletMasterLabel) => Promise<void>;
    //
    register: UseFormRegister<PalletMasterLabel>;
    handleSubmit: UseFormHandleSubmit<PalletMasterLabel>;
    errors: FieldErrors<PalletMasterLabel>;
    setValue: UseFormSetValue<PalletMasterLabel>;
    getValues: UseFormGetValues<PalletMasterLabel>;
}

const PalletMasterContext = React.createContext<PalletMasterContext | null>(null);

const PalletMasterProvider = ({ children }: PalletMasterProviderProps) => {
    const [palletMaster, setPalletMaster] = useState<PalletMasterLabel>({})
    const api = new PalletMasterApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm<PalletMasterLabel>()

    const getPalletMaster = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setPalletMaster(response);
    }

    const getPalletMasterByOrderId = async (orderId: number) => {
        const response = await api.get<PalletMasterLabel>({ endpoint: `order/${orderId}` });
        setPalletMaster({ ...response, id: 0 });
    }

    const createMasterPallet = async (data: PalletMasterLabel) => {
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
            const response = await api.get<PalletMasterLabel>({ endpoint: `order/${data.orderId}` });
            setPalletMaster({ ...response, id: 0 });

            toast.success('Pallet Master created successfully');
        } catch (error) {
            toast.error('Error creating Pallet Master');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: PalletMasterLabel) => {
        try {
            const values = getValues();
            await createMasterPallet({ ...data, ...values });
            const response = await apiSubaru.downloadLabel({
                endpoint: 'PalletMasterLabel', data
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'pallet-master-label.pdf';

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
        palletMaster,
        setPalletMaster,
        getPalletMaster,
        getPalletMasterByOrderId,
        createMasterPallet,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue,
        getValues
    }), [palletMaster])

    return (
        <PalletMasterContext.Provider value={value}>
            {children}
        </PalletMasterContext.Provider>
    );
};

export const usePalletMasterContext = () => {
    const context = React.useContext(PalletMasterContext);
    if (!context) {
        throw new Error('usePalletMasterContext must be used within a PalletMasterProvider');
    }
    return context;
};

export default PalletMasterProvider;
