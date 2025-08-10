import { UserData } from "@/interfaces/auth/UserData";
import { BaseService, BaseServiceResponse } from "../BaseService";
import axiosInstance from '../axiosConfig';

class AuthenticateApi extends BaseService<Record<string, any>> {
    constructor() {
        super('Auth');
    }

    async login(username: string, password: string): Promise<string> {
        const response = await axiosInstance.post<Record<string, any>>(
            this.buildUrl('login'),
            { username, password }
        );

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }

        const token = response.data['token'] as string;
        if (token) {
            localStorage.setItem('accessToken', token);
        }
        return token;
    }

    async refreshToken(): Promise<string> {
        const response = await axiosInstance.post<Record<string, any>>(
            this.buildUrl('refresh')
        );

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status}`);
        }

        const token = response.data['token'] as string;
        if (token) {
            localStorage.setItem('accessToken', token);
        }
        return token;
    }

    async logout(): Promise<void> {
        await axiosInstance.delete(
            this.buildUrl('logout')
        );
        localStorage.removeItem('accessToken');
    }

    async getDataUser(): Promise<BaseServiceResponse> {
        return await this.get() as BaseServiceResponse;
    }
}

export const authenticateApi = new AuthenticateApi();
export default AuthenticateApi;
export type AuthenticateApiType = AuthenticateApi;