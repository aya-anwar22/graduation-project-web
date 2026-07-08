import axios, { AxiosError } from 'axios';
import type { TeamApiResponse, TeamServiceError } from '../types/myTeam.interface';
const url = import.meta.env.VITE_API_URL;

// دالة للحصول على التوكن من localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};

// دالة لتحديث التوكن إذا منتهي
const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return null;

        const response = await axios.post(`${url}/api/v1/auth/refresh`, {
            refreshToken
        });

        if (response.data.success) {
            const newToken = response.data.data.accessToken;
            localStorage.setItem('token', newToken);
            return newToken;
        }
        return null;
    } catch (error) {
        console.error('فشل في تجديد التوكن:', error);
        // تسجيل خروج المستخدم
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return null;
    }
};

// إنشاء instance مخصصة لـ axios مع إعدادات أساسية
const apiClient = axios.create({
    baseURL: `${url}/api/v1`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor لإضافة التوكن
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

// Interceptor للتعامل مع الأخطاء والتجديد التلقائي للتوكن
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // إذا كان الخطأ 401 ولم يتم إعادة المحاولة بعد
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // محاولة تجديد التوكن
                const newToken = await refreshToken();
                if (newToken) {
                    // إعادة إرسال الطلب الأصلي مع التوكن الجديد
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('فشل تجديد التوكن:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export class TeamService {
    /**
     * جلب بيانات فريق المستخدم الحالي
     */
    static async getMyTeam(): Promise<TeamApiResponse | TeamServiceError> {
        try {
            // التحقق من وجود التوكن أولاً
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً للوصول إلى بيانات الفريق'
                };
            }

            const response = await apiClient.get<TeamApiResponse>('/teams/my-team', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // التحقق من الاستجابة
            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب بيانات الفريق'
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * جلب بيانات فريق محدد بواسطة الـ ID
     */
    static async getTeamById(teamId: string): Promise<TeamApiResponse | TeamServiceError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.get<TeamApiResponse>(`/teams/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في جلب بيانات الفريق'
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * معالجة الأخطاء بشكل موحد
     */
    private static handleError(error: any): TeamServiceError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message?: string }>;

            console.log('API Error Details:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config
            });

            // رسائل الخطأ حسب الحالة
            if (axiosError.response) {
                const status = axiosError.response.status;

                switch (status) {
                    case 401:
                        // تسجيل خروج المستخدم
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');

                        return {
                            success: false,
                            message: 'انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.',
                            error: axiosError.response.data
                        };
                    case 403:
                        return {
                            success: false,
                            message: 'ليس لديك صلاحية للوصول إلى هذه البيانات.',
                            error: axiosError.response.data
                        };
                    case 404:
                        return {
                            success: false,
                            message: 'لم يتم العثور على بيانات الفريق.',
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

        // خطأ عام
        return {
            success: false,
            message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            error
        };
    }

    /**
     * التحقق مما إذا كان المستخدم مسجلاً دخول
     */
    static isAuthenticated(): boolean {
        return !!getAuthToken();
    }

    /**
     * تسجيل خروج المستخدم
     */
    static logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    /**
     * الحصول على التوكن الحالي
     */
    static getCurrentToken(): string | null {
        return getAuthToken();
    }
}

// Helper function للتحقق من صورة العضو
export const getMemberImageUrl = (image: string | null): string => {
    if (!image) {
        // صورة افتراضية إذا لم توجد صورة
        return 'https://via.placeholder.com/150/cccccc/ffffff?text=No+Image';
    }

    // إذا كانت الصورة من Cloudinary أو رابط مباشر
    if (image.startsWith('http')) {
        return image;
    }

    // يمكنك إضافة منطق إضافي هنا إذا كانت الصورة مخزنة محلياً
    return image;
};

// Helper function لعرض دور العضو
export const formatMemberRole = (role: string): string => {
    const rolesMap: Record<string, string> = {
        'Front end': 'مطور واجهة أمامية',
        'Back end': 'مطور واجهة خلفية',
        'Full Stack': 'مطور متكامل',
        'UI/UX': 'مصمم واجهة المستخدم',
        'Database': 'مسؤول قواعد البيانات',
        'DevOps': 'مهندس نظم',
        'Team Lead': 'قائد الفريق',
        'Project Manager': 'مدير المشروع'
    };

    return rolesMap[role] || role;
};

export default TeamService;