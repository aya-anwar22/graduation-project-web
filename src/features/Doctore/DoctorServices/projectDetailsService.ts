// DoctorServices/projectDetailsService.ts
import type { ProjectDetailsResponse } from '../TypesDoctor/projectDetails.interface';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// الحصول على التوكن
const getToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (token) return token;

    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) return sessionToken;

    return null;
};

// إنشاء headers مع التوكن
const createHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// دالة مساعدة للتعامل مع الاستجابات
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('انتهت الجلسة. الرجاء تسجيل الدخول مرة أخرى.');
        }
        if (response.status === 403) {
            throw new Error('ليس لديك صلاحية للوصول إلى هذه البيانات.');
        }
        if (response.status === 404) {
            throw new Error('المشروع غير موجود.');
        }
        throw new Error(`خطأ في الطلب: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

// جلب تفاصيل المشروع
export const getProjectDetails = async (projectId: string): Promise<ProjectDetailsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/doctor/${projectId}`, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<ProjectDetailsResponse>(response);
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};


// ✅ تغيير حالة المشروع (مميز / عادي)
export const updateProjectStatus = async (projectId: string, status: 'start' | 'completed') => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Unauthorized - No token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/projects/doctor/projects/${projectId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update project status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Project status updated:', data);
        return data;
    } catch (error) {
        console.error('❌ Error updating project status:', error);
        throw error;
    }
};