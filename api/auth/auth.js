import axios from "axios";
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
    });
    return res.data;
};