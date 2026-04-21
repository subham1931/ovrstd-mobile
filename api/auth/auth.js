import axios from "axios";
import * as SecureStore from "expo-secure-store";
import api, { BASE_URL } from "../config";

export const authLogin = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const authRegister = async (formData) => {
    const res = await axios.post(`${BASE_URL}auth/register`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
    });
    return res.data;
};

export const updateProfile = async (formData) => {
    const token = await SecureStore.getItemAsync("authToken");
    const res = await axios.put(`${BASE_URL}auth/updateProfile`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    });
    return res.data;
};

export const addAddress = async (addressData) => {
    const res = await api.post("/auth/address", addressData);
    return res.data;
};

export const updateAddress = async (addressId, addressData) => {
    const res = await api.put(`/auth/address/${addressId}`, addressData);
    return res.data;
};

export const deleteAddress = async (addressId) => {
    const res = await api.delete(`/auth/address/${addressId}`);
    return res.data;
};

export const toggleWishlist = async (productId) => {
    const res = await api.post("/auth/wishlist", { productId });
    return res.data;
};

export const getUserProfile = async (userId) => {
    const res = await api.get(`/auth/${userId}`);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get("/auth/profile");
    return res.data;
};

export const getCart = async () => {
    const res = await api.get("/auth/cart");
    return res.data;
};

export const addToCart = async (productId, quantity) => {
    const res = await api.post("/auth/cart", { productId, quantity });
    return res.data;
};

export const removeFromCart = async (productId) => {
    const res = await api.post(`/auth/cart/${productId}`, { productId });
    return res.data;
};