import axios from "axios";

export const authLogin = async (data, url) => {
    try {
        const res = await axios.post(url, data);
        return { data: res }
    } catch (error) {
        console.log(error);
        throw error;
    }
}