'use client'
import { SpecialRackLabel } from "@/interfaces/labels/ISpecialRack";
import { BaseService } from "@/services/api/BaseService";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface SpecialRackProviderProps {
    children: React.ReactNode;
}

interface SpecialRackContext {
    specialRack: SpecialRackLabel;
    setSpecialRack: (specialRack: SpecialRackLabel) => void;
    getSpecialRack: (orderId: number) => Promise<void>;
    getSpecialRackByOrderId: (orderId: number) => Promise<void>;
    createSpecialRack: (data: SpecialRackLabel) => Promise<void>;
    dowloadLabel: (data: SpecialRackLabel) => Promise<void>;
    //
    register: UseFormRegister<SpecialRackLabel>;
    handleSubmit: UseFormHandleSubmit<SpecialRackLabel>;
    errors: FieldErrors<SpecialRackLabel>;
    setValue: UseFormSetValue<SpecialRackLabel>;
    clearRegister: () => void;
}

const SpecialRackContext = React.createContext<SpecialRackContext | null>(null);

const SpecialRackProvider = ({ children }: SpecialRackProviderProps) => {
    const [specialRack, setSpecialRack] = useState<SpecialRackLabel>({})
    const api = new BaseService<SpecialRackLabel>('SpecialRack');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<SpecialRackLabel>()

    const getSpecialRack = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setSpecialRack(response);
    }

    const getSpecialRackByOrderId = async (orderId: number) => {
        const response = await api.get<SpecialRackLabel>({ endpoint: `order/${orderId}` });
        setSpecialRack({ ...response, id: 0 });
    }

    const createSpecialRack = async (data: SpecialRackLabel) => {
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
            const response = await api.get<SpecialRackLabel>({ endpoint: `order/${data.orderId}` });
            setSpecialRack({ ...response, id: 0 });

            toast.success('Special Rack created successfully');
        } catch (error) {
            toast.error('Error creating Special Rack');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: SpecialRackLabel) => {
        try {
            console.log(data);
            await createSpecialRack(data);
            const response = await apiSubaru.downloadLabel({
                endpoint: 'SpecialRackLabel', data
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'specialRack-label.pdf';

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            toast.error('Error downloading Special Rack');
            console.log(error);
        }
    }

    const clearRegister = () => {
        setValue('supplierCode', "A361-01");
        setValue('kanban', "");
        setValue('whLoc', "");
        setValue('shopCode', "");
        setValue('mainRoute', "");
        setValue('srLoad', "");
        setValue('shuttleLoad', "");
        setValue('shuttleLoad2', "");
        setValue('supplierArea', "");
    }

    const value = useMemo(() => ({
        specialRack,
        setSpecialRack,
        getSpecialRack,
        getSpecialRackByOrderId,
        createSpecialRack,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue,
        clearRegister
    }), [specialRack])

    return (
        <SpecialRackContext.Provider value={value}>
            {children}
        </SpecialRackContext.Provider>
    );
};

export const useSpecialRackContext = () => {
    const context = React.useContext(SpecialRackContext);
    if (!context) {
        throw new Error('useSpecialRackContext must be used within a SpecialRackProvider');
    }
    return context;
};

export default SpecialRackProvider;
