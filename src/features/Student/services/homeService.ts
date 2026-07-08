// services/projectService.ts
import axios, { AxiosError } from 'axios';
import type {
    ProjectStatsApiResponse,
    ProjectStatsServiceError,
    ActiveProjectApiResponse,
    ActiveProjectServiceError,
    ProjectsListApiResponse,
    ProjectsListServiceError
} from '../types/home.interface';

// دالة للحصول على التوكن من localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};
// const url = 'http://localhost:3000'
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

// Response Interceptor للتعامل مع الأخطاء
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn('جلسة تسجيل الدخول منتهية');
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// معالجة الأخطاء العامة
const handleApiError = (error: any): any => {
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
                        message: 'ليس لديك صلاحية للوصول إلى البيانات.',
                        error: axiosError.response.data
                    };
                case 404:
                    return {
                        success: false,
                        message: 'لم يتم العثور على البيانات المطلوبة.',
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
};

export class ProjectService {
    /**
     * جلب إحصائيات المشاريع
     */
    static async getProjectStats(): Promise<ProjectStatsApiResponse | ProjectStatsServiceError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.get<ProjectStatsApiResponse>('/projects/stats', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب الإحصائيات'
                };
            }
        } catch (error) {
            return handleApiError(error) as ProjectStatsServiceError;
        }
    }

    /**
     * جلب مشروعي النشط
     */
    static async getMyActiveProject(): Promise<ActiveProjectApiResponse | ActiveProjectServiceError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.get<ActiveProjectApiResponse>('/projects/my-project', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب المشروع النشط'
                };
            }
        } catch (error) {
            return handleApiError(error) as ActiveProjectServiceError;
        }
    }

    /**
     * جلب جميع المشاريع حسب الحالة
     */
    static async getAllProjects(
        status?: 'start' | 'in-progress' | 'completed',
        page: number = 1,
        limit: number = 10
    ): Promise<ProjectsListApiResponse | ProjectsListServiceError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const params: any = { page, limit };
            if (status) {
                params.status = status;
            }

            const response = await apiClient.get<ProjectsListApiResponse>('/projects/all');
            console.log("Data in Home",response.data.data);
            
            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب المشاريع'
                };
            }
        } catch (error) {
            return handleApiError(error) as ProjectsListServiceError;
        }
    }

    /**
     * جلب المشاريع المميزة (المشاريع المكتملة)
     */
    static async getFeaturedProjects(limit: number = 3): Promise<ProjectsListApiResponse | ProjectsListServiceError> {
        try {
            const result = await this.getAllProjects('completed', 1, limit);
            return result;
        } catch (error) {
            return handleApiError(error) as ProjectsListServiceError;
        }
    }

    /**
     * جلب إحصائيات المشاريع مع تحسين البيانات
     */
    static async getEnhancedProjectStats(): Promise<ProjectStatsApiResponse | ProjectStatsServiceError> {
        try {
            const result = await this.getProjectStats();

            if (result.success && result.data) {
                const enhancedData = {
                    ...result.data,
                    inProgressProjects: result.data.totalProjects - result.data.completedProjects
                };

                return {
                    ...result,
                    data: enhancedData
                };
            }

            return result;
        } catch (error) {
            return handleApiError(error) as ProjectStatsServiceError;
        }
    }

    /**
     * التحقق من تسجيل الدخول
     */
    static isAuthenticated(): boolean {
        return !!getAuthToken();
    }
}

// Helper functions للإحصائيات
export const getStatsIcon = (type: string): string => {
    const icons: Record<string, string> = {
        'totalProjects': 'folder',
        'completedProjects': 'check_circle',
        'inProgressProjects': 'pending',
        'currentYearProjects': 'calendar_month',
        'averageRating': 'star'
    };

    return icons[type] || 'analytics';
};

export const getStatsColor = (type: string): { bg: string; text: string } => {
    const colors: Record<string, { bg: string; text: string }> = {
        'totalProjects': {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400'
        },
        'completedProjects': {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-600 dark:text-green-400'
        },
        'inProgressProjects': {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-600 dark:text-yellow-400'
        },
        'currentYearProjects': {
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            text: 'text-purple-600 dark:text-purple-400'
        },
        'averageRating': {
            bg: 'bg-orange-100 dark:bg-orange-900/30',
            text: 'text-orange-600 dark:text-orange-400'
        }
    };

    return colors[type] || {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-600 dark:text-gray-400'
    };
};

export const getStatsTitle = (type: string): string => {
    const titles: Record<string, string> = {
        'totalProjects': 'إجمالي المشاريع',
        'completedProjects': 'المشاريع المكتملة',
        'inProgressProjects': 'المشاريع قيد التنفيذ',
        'currentYearProjects': 'مشاريع السنة الحالية',
        'averageRating': 'متوسط التقييم'
    };

    return titles[type] || type;
};

// Helper functions للمشاريع
export const getProjectStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
        'start': 'مبدئي',
        'in-progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'pending': 'قيد الانتظار'
    };
    return statusMap[status] || status;
};

export const getProjectStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
        'start': 'bg-blue-500',
        'in-progress': 'bg-yellow-500',
        'completed': 'bg-green-500',
        'pending': 'bg-gray-500'
    };
    return colorMap[status] || 'bg-gray-500';
};

export const getProjectTypeText = (type: string): string => {
    const typeMap: Record<string, string> = {
        'web': 'ويب',
        'mobile': 'جوال',
        'desktop': 'سطح مكتب'
    };
    return typeMap[type] || type;
};

export const getDefaultProjectImage = (type: string, category?: string): string => {
    const images = {
        'web': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'mobile': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'desktop': 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'health': 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'education': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'default': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };

    if (category?.includes('صحة') || category?.includes('health')) return images.health;
    if (category?.includes('تعليم') || category?.includes('education')) return images.education;

    return images[type as keyof typeof images] || images.default;
};

export default ProjectService;