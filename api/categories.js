import api from "./config";

export const getCategories = async () => {
    const res = await api.get("/api/categories");
    return res.data;
};
