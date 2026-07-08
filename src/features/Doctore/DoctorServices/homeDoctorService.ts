// DoctorServices/homeDoctorService.ts

import type { DashboardStatsResponse, Project, ProjectsResponse } from "../TypesDoctor/homeDoctor.interfase";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// دالة للحصول على التوكن
const getToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    
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
    return await response.json();
};

export const dashboardService = {
    // إحصائيات Dashboard
    getDashboardStats: async (): Promise<DashboardStatsResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/projects/doctor/stats`, {
                method: 'GET',
                headers: createHeaders(),
            });
            return await handleResponse<DashboardStatsResponse>(response);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // المشاريع المميزة (Featured Projects)
    getFeaturedProjects: async (): Promise<Project[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/projects/all/doctor?status=start`, {
                method: 'GET',
                headers: createHeaders(),
            });
            
            const data: ProjectsResponse = await handleResponse<ProjectsResponse>(response);
            
            if (data.success && data.data) {
                // إرجاع البيانات كما هي من API بدون تعديل
                return data.data;
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching featured projects:', error);
            throw error;
        }
    },

    // الحصول على جميع المشاريع مع فلتر
    getAllProjects: async (status?: string, page?: number, limit?: number): Promise<ProjectsResponse> => {
        try {
            let url = `${API_BASE_URL}/api/v1/projects/all/doctor`;
            const params = new URLSearchParams();
            
            if (status) params.append('status', status);
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());
            
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: createHeaders(),
            });
            
            return await handleResponse<ProjectsResponse>(response);
        } catch (error) {
            console.error('Error fetching all projects:', error);
            throw error;
        }
    },

    // تحديث حالة المشروع
    updateProjectStatus: async (projectId: string, status: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}/status`, {
                method: 'PUT',
                headers: createHeaders(),
                body: JSON.stringify({ status }),
            });
            
            return await handleResponse<{ success: boolean; message: string }>(response);
        } catch (error) {
            console.error('Error updating project status:', error);
            throw error;
        }
    }
};