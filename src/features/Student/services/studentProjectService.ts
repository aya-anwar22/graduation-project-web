// src/features/Student/services/studentProjectService.ts
import axios, { AxiosError } from 'axios';
import type { ProjectsApiResponse, ProjectFilters, Project } from '../types/project.types';

const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
};

const url = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: `${url}/api/v1`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 Response:', response.status, response.config.url);
        return response;
    },
    async (error: AxiosError) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export class StudentProjectService {
    /**
     * جلب جميع المشاريع حسب الحالة
     */
    static async getAllProjects(
        filters?: ProjectFilters,
        page: number = 1,
        limit: number = 10
    ): Promise<ProjectsApiResponse> {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            const params: any = { page, limit };
            if (filters?.status && filters.status !== 'all') params.status = filters.status;
            if (filters?.type && filters.type !== 'all') params.type = filters.type;
            if (filters?.year && filters.year !== 'all') params.year = filters.year;

            const response = await apiClient.get<ProjectsApiResponse>('/projects/all', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            console.log('📚 Projects fetched:', response.data.data?.length || 0);
            return response.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    /**
     * جلب تفاصيل مشروع محدد
     * ملاحظة: بما أن الـ API لا يوفر endpoint منفصل، نستخدم البيانات من getAllProjects
     */
    static async getProjectById(projectId: string): Promise<{ data: Project }> {
        try {
            // أولاً: نحاول جلب المشروع من قائمة جميع المشاريع
            const allProjects = await this.getAllProjects({ status: 'all', search: '', type: 'all', year: 'all', category: 'all' }, 1, 100);
            const project = allProjects.data.find(p => p.projectId === projectId);
            
            if (project) {
                console.log('🔍 Project found in list:', project.projectTitle);
                return { data: project };
            }

            // إذا لم نجد المشروع، نحاول استخدام endpoint مختلف (إذا كان موجوداً)
            // ملاحظة: هذا قد لا يعمل إذا كان الـ endpoint غير موجود
            try {
                const response = await apiClient.get(`/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${getAuthToken()}` }
                });
                return response.data;
            } catch (err) {
                console.warn('Project details endpoint not available, using fallback');
                throw new Error('Project not found');
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
            throw error;
        }
    }

    /**
     * جلب المشاريع المميزة (المكتملة)
     */
    static async getFeaturedProjects(limit: number = 3): Promise<ProjectsApiResponse> {
        try {
            const result = await this.getAllProjects({ 
                status: 'completed', 
                search: '', 
                type: 'all', 
                year: 'all', 
                category: 'all' 
            }, 1, limit);
            return result;
        } catch (error) {
            console.error('Error fetching featured projects:', error);
            throw error;
        }
    }

    /**
     * البحث عن المشاريع
     */
    static async searchProjects(query: string): Promise<ProjectsApiResponse> {
        try {
            return await this.getAllProjects({ 
                status: 'all', 
                search: query, 
                type: 'all', 
                year: 'all', 
                category: 'all' 
            });
        } catch (error) {
            console.error('Error searching projects:', error);
            throw error;
        }
    }
}

export default StudentProjectService;