// services/projectDetailsService.ts
import axios, { AxiosError } from 'axios';
import type { ProjectData } from '../types/myProject.interface';

export interface ProjectDetailsResponse {
    success: boolean;
    message: string;
    data: ProjectData;
    timestamp?: string;
}

export interface ProjectDetailsError {
    success: false;
    message: string;
    error?: any;
}

// دالة للحصول على التوكن من localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};
const url = import.meta.env.VITE_API_URL;

// إنشاء instance مخصصة لـ axios
const apiClient = axios.create({
    baseURL: `${url}/api/v1`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor لإضافة التوكن
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export class ProjectDetailsService {
    /**
     * جلب تفاصيل مشروع معين
     */
    static async getProjectDetails(projectId: string): Promise<ProjectDetailsResponse | ProjectDetailsError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.get<ProjectDetailsResponse>(
                `/projects/details/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب تفاصيل المشروع'
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * معالجة الأخطاء
     */
    private static handleError(error: any): ProjectDetailsError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message?: string }>;

            if (axiosError.response) {
                const status = axiosError.response.status;

                switch (status) {
                    case 401:
                        return {
                            success: false,
                            message: 'انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.',
                            error: axiosError.response.data
                        };
                    case 403:
                        return {
                            success: false,
                            message: 'ليس لديك صلاحية لعرض تفاصيل هذا المشروع.',
                            error: axiosError.response.data
                        };
                    case 404:
                        return {
                            success: false,
                            message: 'لم يتم العثور على المشروع.',
                            error: axiosError.response.data
                        };
                    case 500:
                        return {
                            success: false,
                            message: 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
                            error: axiosError.response.data
                        };
                    default:
                        return {
                            success: false,
                            message: axiosError.response.data?.message || 'حدث خطأ غير متوقع',
                            error: axiosError.response.data
                        };
                }
            } else if (axiosError.request) {
                return {
                    success: false,
                    message: 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
                    error: axiosError.request
                };
            }
        }

        return {
            success: false,
            message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            error
        };
    }
}

export default ProjectDetailsService;