import axios from 'axios';
import type { Login, LoginResponse } from '../types/login.interface';
import type { SingUpData, Verify } from '../types/signup.interface';
import type { resetPasswordType } from '../types/resetPassword.interface';
import { toast } from 'react-toastify';

const api_url = import.meta.env.VITE_API_URL;
// const api_url = 'http://localhost:3000/api/v1/auth';

console.log(import.meta.env.VITE_API_URL);


export const singUp = async (data: SingUpData): Promise<{ error: string }> => {
    try {
        const response = await axios.post(`${api_url}/api/v1/auth/sign-up`, data);
        console.log(response);

        return response.data;
    } catch (error: any) {

        if (error.response) {
            console.error("Server error:", error.response.data);
            return { error: error.response.data.message || "Server error" };
        } else if (error.request) {
            console.error("No response received:", error.request);
            return { error: "No response from server" };
        } else {
            console.error("error:", error.message);
            return { error: error.message };
        }

    }

}



export const login = async (data: Login): Promise<LoginResponse | { error: string }> => {
    try {
        const response = await axios.post(`${api_url}/api/v1/auth/login`, data);
        // const response = await api.post("/login",data)
        console.log(response);
        console.log(api_url);
        console.log("import .env",import.meta.env.VITE_API_URL);

        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);


        return response.data;
    } catch (error: any) {

        if (error.response) {
            console.error("Server error:", error.response.data);
            toast.error(error.response.data);
            return { error: error.response.data.message || "Server error" };
        } else if (error.request) {
            console.error("No response received:", error.request);
            return { error: "No response from server" };
        } else {
            console.error("error:", error.message);
            return { error: error.message };
        }

    }

}
export const refreshTokenRequest = (refreshToken: string) => {
    return axios.post(`${api_url}/api/v1/auth/refresh-token`, { refreshToken });
}

export const verify = async (data: Verify): Promise<{ error: string }> => {
    try {
        const response = await axios.post(`${api_url}/api/v1/auth/verify-email`, data);
        console.log(response);

        return response.data;
    } catch (error: any) {

        if (error.response) {
            console.error("Server error:", error.response.data);
            return { error: error.response.data.message || "Server error" };
        } else if (error.request) {
            console.error("No response received:", error.request);
            return { error: "No response from server" };
        } else {
            console.error("error:", error.message);
            return { error: error.message };
        }

    }

}
export const forgetPassword = async (data: { email: string }): Promise<{ error: string }> => {
    try {
        const response = await axios.post(`${api_url}/api/v1/auth/forget-password`, data);
        console.log(response);

        return response.data;
    } catch (error: any) {

        if (error.response) {
            console.error("Server error:", error.response.data);
            return { error: error.response.data.message || "Server error" };
        } else if (error.request) {
            console.error("No response received:", error.request);
            return { error: "No response from server" };
        } else {
            console.error("error:", error.message);
            return { error: error.message };
        }

    }

}
export const resetPassword = async (data: resetPasswordType): Promise<resetPasswordType | { error: string }> => {
    try {
        const response = await axios.post(`${api_url}/api/v1/auth/reset-password`, data);
        console.log(response);

        return response.data;
    } catch (error: any) {

        if (error.response) {
            console.error("Server error:", error.response.data);
            return { error: error.response.data.message || "Server error" };
        } else if (error.request) {
            console.error("No response received:", error.request);
            return { error: "No response from server" };
        } else {
            console.error("error:", error.message);
            return { error: error.message };
        }
    }

}