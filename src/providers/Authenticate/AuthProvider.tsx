'use client'
import { useAppDispatch } from '@/app/store';
import { useRouter } from '@/navigation';
import { authenticateApi } from '@/services/api/authenticate/authenticate';
import { setAuth, setCredentials, setError, setLogout } from '@/store/features/auth/authSlice';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm, UseFormRegister } from "react-hook-form";
import { UserData } from '@/interfaces/auth/UserData';

interface AuthContextType {
    loadingAuth: boolean;
    setLoadingAuth: (loading: boolean) => void;
    refresh: boolean;
    setRefresh: (refresh: boolean) => void;
    authenticate: () => Promise<void>;
    refreshToken: () => Promise<void>;
    register: UseFormRegister<any>;
    handleSubmit: (onValid: (data: any) => void) => (event?: React.BaseSyntheticEvent) => Promise<void>;
    errors: any;
    setValue: (name: string, value: any) => void;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [refresh, setRefresh] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const auth = async () => await authenticate();
        auth();
    }, [refresh]);

    const authenticate = async () => {
        dispatch(setAuth());
        try {
            const response = await authenticateApi.getDataUser();

            dispatch(setCredentials({ user: response.data }));

        } catch (error) {
            dispatch(setError({ error }));
            console.log(error);
        }
        setLoadingAuth(false);
    };

    const refreshToken = async () => {
        try {
            const response = await authenticateApi.refreshToken();
            if (response) {
                localStorage.setItem('accessToken', response); // Store the new token
                // Handle token refresh success (e.g., update token in local storage)
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            toast.error('Token refresh failed. Please log in again.');
        }
    };

    const login = async (username: string, password: string) => {

        try {
            const response = await authenticateApi.login(username, password);
            if (!response) throw new Error('Login failed: No response from server');

            localStorage.setItem('accessToken', response);

            toast.success('Login successful!');
            setRefresh(true);
            router.push('/schedules');
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials and try again.');
            dispatch(setError({ error }));
        }

    };

    const logout = async () => {
        await authenticateApi.logout();
        dispatch(setLogout());
    };

    const paramsProvider = {
        loadingAuth,
        setLoadingAuth,
        refresh,
        setRefresh,
        login,
        logout,
        authenticate,
        refreshToken,
        register,
        handleSubmit,
        errors,
        setValue
    };

    return (
        <AuthContext.Provider value={paramsProvider}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
