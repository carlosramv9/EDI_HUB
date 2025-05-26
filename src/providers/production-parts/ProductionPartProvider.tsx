'use client'
import { ProductionPartLabel } from "@/interfaces/labels/IProductionParts";
import ProductionPartApi from "@/services/api/labels/productionPartApi";
import { apiSubaru } from "@/services/api/subaru/SubaruApi";
import React, { useMemo, useState } from "react";
import { FieldErrors, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface ProductionPartProviderProps {
    children: React.ReactNode;
}

interface ProductionPartContext {
    productionPart: ProductionPartLabel;
    setProductionPart: (productionPart: ProductionPartLabel) => void;
    getProductionPart: (orderId: number) => Promise<void>;
    getProductionPartByOrderId: (orderId: number) => Promise<void>;
    createMasterPallet: (data: ProductionPartLabel) => Promise<void>;
    dowloadLabel: (data: ProductionPartLabel) => Promise<void>;
    //
    register: UseFormRegister<ProductionPartLabel>;
    handleSubmit: UseFormHandleSubmit<ProductionPartLabel>;
    errors: FieldErrors<ProductionPartLabel>;
    setValue: UseFormSetValue<ProductionPartLabel>;
}

const ProductionPartContext = React.createContext<ProductionPartContext | null>(null);

const ProductionPartProvider = ({ children }: ProductionPartProviderProps) => {
    const [productionPart, setProductionPart] = useState<ProductionPartLabel>({})
    const api = new ProductionPartApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ProductionPartLabel>()

    const getProductionPart = async (orderId: number) => {
        const response = await api.getById({ id: orderId });
        setProductionPart(response);
    }

    const getProductionPartByOrderId = async (orderId: number) => {
        const response = await api.get<ProductionPartLabel>({ endpoint: `order/${orderId}` });
        setProductionPart({ ...response, id: 0 });
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
            setProductionPart({ ...response, id: 0 });

            toast.success('Pallet Master created successfully');
        } catch (error) {
            toast.error('Error creating Pallet Master');
            console.log(error);
        }
    }

    const dowloadLabel = async (data: ProductionPartLabel) => {
        try {
            await createMasterPallet(data);
            const response = await apiSubaru.downloadLabel({
                endpoint: 'ProductionPartLabel', data
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
        productionPart,
        setProductionPart,
        getProductionPart,
        getProductionPartByOrderId,
        createMasterPallet,
        dowloadLabel,
        register,
        handleSubmit,
        errors,
        setValue
    }), [productionPart])

    return (
        <ProductionPartContext.Provider value={value}>
            {children}
        </ProductionPartContext.Provider>
    );
};

export const useProductionPartContext = () => {
    const context = React.useContext(ProductionPartContext);
    if (!context) {
        throw new Error('useProductionPartContext must be used within a ProductionPartProvider');
    }
    return context;
};

export default ProductionPartProvider;
