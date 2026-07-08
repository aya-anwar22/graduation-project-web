// services/projectUpdateService.ts
import axios, { AxiosError } from 'axios';

export interface UpdateProjectData {
    image?: File | null;
    description?: string;
    projectType?: string;
    projectLink?: string;
    technologies?: string[];
    mainObjective?: string;
    projectId: string;
}

export interface UpdateProjectResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}
    const url = import.meta.env.VITE_API_URL;

// دالة للحصول على التوكن من localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};


// إنشاء instance مخصصة لـ axios
const apiClient = axios.create({
    baseURL: `${url}/api/v1`,
    timeout: 30000,
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

export class ProjectUpdateService {
    /**
     * تحديث بيانات المشروع
     */
    static async updateProject(data: UpdateProjectData): Promise<UpdateProjectResponse> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            // إنشاء FormData إذا كان هناك ملف صورة
            let requestData: FormData | any;
            let headers: any = {
                'Authorization': `Bearer ${token}`
            };

            if (data.image) {
                // استخدام FormData إذا كان هناك صورة
                requestData = new FormData();
                
                // إضافة البيانات الأساسية
                requestData.append('description', data.description || '');
                requestData.append('projectType', data.projectType || '');
                requestData.append('projectLink', data.projectLink || '');
                requestData.append('mainObjective', data.mainObjective || '');
                requestData.append('projectId', data.projectId);
                
                // إضافة التكنولوجيا كمصفوفة JSON
                if (data.technologies && data.technologies.length > 0) {
                    requestData.append('technologies', JSON.stringify(data.technologies));
                }
                
                // إضافة الصورة
                requestData.append('image', data.image);
                
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                // استخدام JSON إذا لم يكن هناك صورة
                requestData = {
                    description: data.description,
                    projectType: data.projectType,
                    projectLink: data.projectLink,
                    technologies: data.technologies,
                    mainObjective: data.mainObjective,
                    projectId: data.projectId
                };
                headers['Content-Type'] = 'application/json';
            }

            const response = await apiClient.patch<UpdateProjectResponse>(
                '/projects/update-project',
                requestData,
                {
                    headers,
                    timeout: 60000
                }
            );

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'تم تحديث المشروع بنجاح',
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في تحديث المشروع',
                    error: response.data.error
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * التحقق من صورة المشروع
     */
    static validateImage(file: File): { 
        isValid: boolean; 
        message?: string 
    } {
        // أنواع الصور المسموح بها
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml'
        ];

        // الحد الأقصى للحجم (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                message: 'نوع الصورة غير مدعوم. يرجى رفع صورة بصيغة JPG, PNG, GIF, WebP, أو SVG.'
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                message: 'حجم الصورة كبير جداً. الحد الأقصى 5MB.'
            };
        }

        return { isValid: true };
    }

    /**
     * التحقق من رابط المشروع
     */
    static validateProjectLink(link: string): { 
        isValid: boolean; 
        message?: string 
    } {
        if (!link) return { isValid: true };
        
        try {
            const url = new URL(link);
            return { isValid: true };
        } catch {
            return {
                isValid: false,
                message: 'الرابط غير صالح. يرجى إدخال رابط صحيح مثل https://example.com'
            };
        }
    }

    /**
     * معالجة الأخطاء
     */
    private static handleError(error: any): UpdateProjectResponse {
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
                            message: 'ليس لديك صلاحية لتعديل المشروع.',
                            error: axiosError.response.data
                        };
                    case 400:
                        return {
                            success: false,
                            message: 'بيانات التحديث غير صالحة.',
                            error: axiosError.response.data
                        };
                    case 404:
                        return {
                            success: false,
                            message: 'المشروع غير موجود.',
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

export default ProjectUpdateService;
