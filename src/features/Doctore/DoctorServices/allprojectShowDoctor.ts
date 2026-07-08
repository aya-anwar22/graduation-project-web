// DoctorServices/projectsService.ts
import type { ProjectsResponse, ProjectStatsResponse } from '../TypesDoctor/projectDoctor.interface';

const API_BASE_URL = import.meta.env.VITE_API_URL;
;

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
            throw new Error('البيانات المطلوبة غير موجودة.');
        }
        throw new Error(`خطأ في الطلب: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

// جلب إحصائيات المشاريع
export const getProjectStats = async (): Promise<ProjectStatsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/doctor/stats`, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<ProjectStatsResponse>(response);
    } catch (error) {
        console.error('Error fetching project stats:', error);
        throw error;
    }
};

// جلب جميع المشاريع مع إمكانية الفلترة
export const getAllProjects = async (
    page: number = 1,
    status?: string,
    year?: string,
    technology?: string
): Promise<ProjectsResponse> => {
    try {
        let url = `${API_BASE_URL}/api/v1/projects/all/doctor?page=${page}`;

        if (status) url += `&status=${status}`;
        if (year) url += `&year=${year}`;
        if (technology) url += `&technology=${technology}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<ProjectsResponse>(response);
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

// جلب المشاريع المميزة
export const getFeaturedProjects = async (): Promise<ProjectsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/all/doctor?featured=true`, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<ProjectsResponse>(response);
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        throw error;
    }
};

// تحديث حالة المشروع
export const updateProjectStatus = async (projectId: string, status: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}/status`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({ status }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error updating project status:', error);
        throw error;
    }
};

// جلب جميع التقنيات المتاحة (للفلاتر)
export const getAllTechnologies = async (): Promise<string[]> => {
    try {
        const response = await getAllProjects(1);
        const technologies = new Set<string>();

        response.data.forEach(project => {
            project.technologies.forEach(tech => technologies.add(tech));
        });

        return Array.from(technologies);
    } catch (error) {
        console.error('Error fetching technologies:', error);
        return [];
    }
};