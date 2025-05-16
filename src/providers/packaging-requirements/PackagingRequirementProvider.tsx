'use client'
import { PackagingRequirementLabel } from "@/interfaces/labels/IPackagingRequirement";
import { ProductionPartLabel } from "@/interfaces/labels/IProductionParts";
import PackagingRequirementApi from "@/services/api/labels/packagingRequirementsApi";
import ProductionPartApi from "@/services/api/labels/productionPartApi";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface PackagingRequirementProviderProps {
    children: React.ReactNode;
}

interface PackagingRequirementContext {
    packagingRequirement: PackagingRequirementLabel;
    setPackagingRequirement: (packagingRequirement: PackagingRequirementLabel) => void;
    getPackagingRequirement: (orderId: number) => Promise<void>;
    getPackagingRequirementByOrderId: (orderId: number) => Promise<void>;
    createMasterPallet: (data: PackagingRequirementLabel) => Promise<void>;
    dowloadLabel: (data: PackagingRequirementLabel) => Promise<void>;
    //
    register: UseFormRegister<PackagingRequirementLabel>;
    handleSubmit: UseFormHandleSubmit<PackagingRequirementLabel>;
    errors: FieldErrors<PackagingRequirementLabel>;
    setValue: UseFormSetValue<PackagingRequirementLabel>;
}

const PackagingRequirementContext = React.createContext<PackagingRequirementContext | null>(null);

const PackagingRequirementProvider = ({ children }: PackagingRequirementProviderProps) => {
    const [packagingRequirement, setPackagingRequirement] = useState<PackagingRequirementLabel>({})
    const api = new ProductionPartApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<PackagingRequirementLabel>()

    const getPackagingRequirement = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setPackagingRequirement(response);
    }

    const getPackagingRequirementByOrderId = async (orderId: number) => {
        const response = await api.get<ProductionPartLabel>({ endpoint: `order/${orderId}` });
        setPackagingRequirement({ ...response, id: 0 });
    }

    const createMasterPallet = async (data: ProductionPartLabel) => {
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
            const response = await api.get<ProductionPartLabel>({ endpoint: `order/${data.orderId}` });
            setPackagingRequirement({ ...response, id: 0 });

            toast.success('Pallet Master created successfully');
        } catch (error) {
            toast.error('Error creating Pallet Master');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: ProductionPartLabel) => {
        try {
            //await createMasterPallet(data);
            const response = await apiSubaru.downloadLabel({
                endpoint: 'PackagingRequirementLabel', data
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'packaging-requirements-label.pdf';
            
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
        packagingRequirement,
        setPackagingRequirement,
        getPackagingRequirement,
        getPackagingRequirementByOrderId,
        createMasterPallet,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue
    }), [packagingRequirement])

    return (
        <PackagingRequirementContext.Provider value={value}>
            {children}
        </PackagingRequirementContext.Provider>
    );
};

export const usePackagingRequirementContext = () => {
    const context = React.useContext(PackagingRequirementContext);
    if (!context) {
        throw new Error('usePackagingRequirementContext must be used within a PackagingRequirementProvider');
    }
    return context;
};

export default PackagingRequirementProvider;
