import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn('API Interceptor - Unauthorized/Forbidden, logging out...');
            useAuthStore.getState().auth.reset();
            window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
    }
);

export default api;
