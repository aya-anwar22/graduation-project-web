// services/fileUploadService.ts
import axios, { AxiosError } from 'axios';

export interface UploadFileResponse {
    success: boolean;
    message: string;
    data?: {
        fileId: string;
        fileName: string;
        filePath: string;
    };
    error?: any;
}

export interface UploadFileError {
    success: false;
    message: string;
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
    timeout: 30000, // زيادة الوقت للملفات الكبيرة
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

export class FileUploadService {
    /**
     * رفع ملف جديد للمشروع
     */
    static async uploadProjectFile(
        file: File,
        description?: string,
        projectId?: string
    ): Promise<UploadFileResponse | UploadFileError> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            // إنشاء FormData
            const formData = new FormData();
            formData.append('file', file);
            
            if (description) {
                formData.append('description', description);
            }
            
            if (projectId) {
                formData.append('projectId', projectId);
            }

            const response = await apiClient.post<UploadFileResponse>(
                '/projects/upload-file',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000, // زيادة الوقت للملفات الكبيرة
                }
            );

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'تم رفع الملف بنجاح',
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في رفع الملف',
                    error: response.data.error
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * حذف ملف من المشروع
     */
    static async deleteProjectFile(
        fileId: string,
        projectId?: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.delete(`/projects/files/${fileId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: projectId ? { projectId } : {}
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'تم حذف الملف بنجاح'
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'فشل في حذف الملف'
                };
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    message: error.response?.data?.message || 'حدث خطأ أثناء حذف الملف'
                };
            }
            return {
                success: false,
                message: 'حدث خطأ غير متوقع'
            };
        }
    }

    /**
     * جلب قائمة الملفات للمشروع
     */
    static async getProjectFiles(
        projectId: string
    ): Promise<{ 
        success: boolean; 
        message: string; 
        data?: any[] 
    }> {
        try {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    message: 'يجب تسجيل الدخول أولاً'
                };
            }

            const response = await apiClient.get(`/projects/${projectId}/files`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return {
                success: true,
                message: response.data.message || 'تم جلب الملفات بنجاح',
                data: response.data.data
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    message: error.response?.data?.message || 'حدث خطأ أثناء جلب الملفات'
                };
            }
            return {
                success: false,
                message: 'حدث خطأ غير متوقع'
            };
        }
    }

    /**
     * معالجة الأخطاء العامة
     */
    private static handleError(error: any): UploadFileError {
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
                            message: 'ليس لديك صلاحية لرفع الملفات.',
                            error: axiosError.response.data
                        };
                    case 400:
                        return {
                            success: false,
                            message: 'الملف غير صالح أو تجاوز الحجم المسموح به.',
                            error: axiosError.response.data
                        };
                    case 413:
                        return {
                            success: false,
                            message: 'حجم الملف كبير جداً. الحد الأقصى 10MB.',
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

    /**
     * التحقق من نوع وحجم الملف
     */
    static validateFile(file: File): { 
        isValid: boolean; 
        message?: string 
    } {
        // أنواع الملفات المسموح بها
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/zip',
            'application/x-rar-compressed'
        ];

        // الحد الأقصى للحجم (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                message: 'نوع الملف غير مدعوم. يرجى رفع ملف بصيغة PDF، Word، Excel، PowerPoint، صورة، أو أرشيف.'
            };
        }

        if (file.size > maxSize) {
            return {
                isValid: false,
                message: 'حجم الملف كبير جداً. الحد الأقصى 10MB.'
            };
        }

        return { isValid: true };
    }
}

export default FileUploadService;