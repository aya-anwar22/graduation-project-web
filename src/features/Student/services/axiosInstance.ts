import axios from "axios";

// const url = 'http://localhost:3000'
const url = import.meta.env.VITE_API_URL;
export const api = axios.create({
    baseURL: `${url}/api/v1`,
});

// ===== Request =====
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});




// ===== Response =====
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
    console.log("🔥 interceptor hit", error.response?.status);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await axios.post(
                    `${url}/api/v1/auth/refresh-token`,
                    { refreshToken }
                );

                localStorage.setItem("accessToken", res.data.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;

                return api(originalRequest);
            } catch {
                localStorage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);
