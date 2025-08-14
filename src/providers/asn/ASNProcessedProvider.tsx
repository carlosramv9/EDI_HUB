'use client'
import { IASNProcessed } from "@/interfaces/asn/IASNProcessed";
import { SMASNProcessed } from "@/interfaces/searchModel/SearchModels";
import { BaseService, BaseServiceResponseArray } from "@/services/api/BaseService";
import dayjs from "dayjs";
import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

interface IASNProcessedProviderProps {
    children: React.ReactNode;
}

interface IASNProcessedContext {
    asnProcessed: IASNProcessed[];
    setASNProcessed: React.Dispatch<React.SetStateAction<IASNProcessed[]>>;
    getASNProcessed: (sm: SMASNProcessed) => Promise<void>;
    downloadASN: (asn: IASNProcessed) => void;
    openMenuId: number | null;
    setOpenMenuId: React.Dispatch<React.SetStateAction<number | null>>;
    searchModel: SMASNProcessed | null;
    setSearchModel: React.Dispatch<React.SetStateAction<SMASNProcessed | null>>;
    total: number;  
    reactivateASN: (asn: IASNProcessed, sm: SMASNProcessed) => Promise<void>;
}

const ASNProcessedContext = createContext<IASNProcessedContext | null>(null);

const ASNProcessedProvider = ({ children }: IASNProcessedProviderProps) => {
    const [asnProcessed, setASNProcessed] = useState<IASNProcessed[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [searchModel, setSearchModel] = useState<SMASNProcessed | null>(null);
    const [total, setTotal] = useState<number>(0);
    const service = new BaseService<IASNProcessed>('ASNProcessed');

    const getASNProcessed = async (sm: SMASNProcessed) => {
        const response = await service.post<BaseServiceResponseArray<IASNProcessed>>({ endpoint: 'list', data: sm });
        setASNProcessed(response.data || []);
        setTotal(response.total || 0);
    }

    const downloadASN = (asn: IASNProcessed) => {
        // Crear el contenido del archivo EDI
        const ediContent = asn.stringASN ?? '';

        // Crear un blob con el contenido EDI
        const blob = new Blob([ediContent], { type: 'text/plain' });

        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un elemento de enlace temporal
        const link = document.createElement('a');
        link.href = url;
        link.download = `ASN_${asn.asnNumber}_${dayjs().format('YYMMDDHHmmss')}.edi`;

        // Agregar el enlace al DOM, hacer clic y removerlo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Liberar la URL del blob
        window.URL.revokeObjectURL(url);
    };

    const reactivateASN = async (asn: IASNProcessed, sm: SMASNProcessed) => {
        try {
            await service.update<IASNProcessed>({ id: asn.id, endpoint: 'activate', data: asn });
            const response = await service.post<BaseServiceResponseArray<IASNProcessed>>({ endpoint: 'list', data: sm });
            setASNProcessed(response.data || []);
            setTotal(response.total || 0);

            toast.success('Envio en cola.');
        } catch (error) {
            toast.error('Error al reactivar la ASN');
        }
    }

    const value = useMemo(() => ({
        asnProcessed, setASNProcessed,
        getASNProcessed, downloadASN,
        openMenuId, setOpenMenuId,
        searchModel, setSearchModel,
        total,
        reactivateASN
    }), [asnProcessed, openMenuId, searchModel, total, reactivateASN]);

    return (
        <ASNProcessedContext.Provider value={value}>
            {children}
        </ASNProcessedContext.Provider>
    );
}

export const useASNProcessed = () => {
    const context = useContext(ASNProcessedContext);
    if (!context) {
        throw new Error('useASNProcessed must be used within a ASNProcessedProvider');
    }
    return context;
}

export default ASNProcessedProvider;