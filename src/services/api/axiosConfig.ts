import axios from 'axios';
import { authenticateApi } from './authenticate/authenticate';

// Crear una instancia personalizada de Axios
const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Añadir un interceptor para loggear las URLs completas
axiosInstance.interceptors.request.use((config) => {
    console.log('Full request URL:', `${config.baseURL || ''}${config.url || ''}`);
    return config;
});

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true;

        const token = localStorage.getItem('accessToken');
        const HEADER_TOKEN: string = process.env['HEADER_TOKEN'] || 'Authorization';

        config.headers = {
            ...config.headers,
            'Access-Control-Allow-Credentials': 'true'
        };

        if (token) {
            config.headers[HEADER_TOKEN] = `${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas con error 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const HEADER_TOKEN: string = process.env['HEADER_TOKEN'] || 'Authorization';

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await authenticateApi.refreshToken();

                if (newToken) {
                    originalRequest.headers[HEADER_TOKEN] = `${newToken}`;
                }

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                if (!window.location.pathname.includes('/authenticate/login')) {
                    window.location.href = '/authenticate/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
