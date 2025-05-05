import { SearchModel } from '@/interfaces/searchModel/SearchModels';
import axiosInstance from './axiosConfig';

export type BaseServiceParams = {
    endpoint?: string;
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    searchModel?: SearchModel;
}

export type BaseServiceIdParams = BaseServiceParams & {
    id?: string | number;
}

export type BaseServiceData = BaseServiceParams & {
    data: any;
}

export type BaseServiceResponse = {
    data: any;
    status: number;
}

export type BaseServiceResponseArray<T> = {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    data: T[];
    status: number;
}

export type BaseServiceResponseVoid = {
    status: number;
}

export type BaseServiceResponseMessage = {
    message: string;
    status: number;
}

export type BaseServiceResponseError = {
    message: string;
    status: number;
}

export class BaseService<T> {
    protected baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    protected buildUrl(endpoint: string = '', id: string | number = ''): string {
        const parts = [process.env[process.env.NODE_ENV], this.baseURL, endpoint, id].filter(Boolean);
        return parts.join('/');
    }

    async getAll({ endpoint = '' }: BaseServiceParams): Promise<BaseServiceResponseArray<T>> {
        const response = await axiosInstance.get<BaseServiceResponseArray<T>>(this.buildUrl(endpoint));
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }

    async get<T>({ endpoint = '' }: BaseServiceParams): Promise<T> {
        const response = await axiosInstance.get<T>(this.buildUrl(endpoint));
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }

    async getById({ endpoint = '', id }: BaseServiceIdParams): Promise<T> {
        const url = this.buildUrl(endpoint, id);
        const response = await axiosInstance.get<T>(url);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }

    async post<T>({ endpoint = '', data }: BaseServiceData): Promise<T> {
        const response = await axiosInstance.post<T>(this.buildUrl(endpoint), data);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }

    async update<T>({ id = '', endpoint = '', data }: BaseServiceIdParams & BaseServiceData): Promise<T> {
        const response = await axiosInstance.put<T>(this.buildUrl(endpoint, id), data);
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }

    async delete({ id, endpoint = '' }: BaseServiceIdParams): Promise<BaseServiceResponseMessage> {
        const response = await axiosInstance.delete<BaseServiceResponseMessage>(this.buildUrl(endpoint, id));
        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.data;
    }
}
