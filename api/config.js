import axios from 'axios';
import * as SecureStore from "expo-secure-store"

// export const BASE_URL = 'http://localhost:3000/'
export const BASE_URL = 'https://ovrstd-server.onrender.com/'

const api = axios.create({
    baseURL:BASE_URL,
    headers:{
        'Content-Type':'application/json'
    },
})

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error fetching auth token for request:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;