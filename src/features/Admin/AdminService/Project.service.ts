// src/services/project.service.ts
import axios, { type AxiosInstance } from 'axios';
import type { Project, ProjectSummary, ProjectFilters, PaginatedResponse } from '../AdminTypes/Project.interface';

class ProjectService {
    private api: AxiosInstance;
    private baseURL = import.meta.env.VITE_API_URL;

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('📤 Request:', config.method?.toUpperCase(), config.url);
            return config;
        });

        this.api.interceptors.response.use(
            (response) => {
                console.log('📥 Response:', response.status, response.config.url);
                return response;
            },
            (error) => {
                console.error('❌ API Error:', error.response?.data || error.message);
                throw error;
            }
        );
    }

    // جلب ملخص المشاريع (الإحصائيات)
    async getProjectsSummary(): Promise<ProjectSummary> {
        try {
            const response = await this.api.get('/admin/dashboard/projects-summary');
            console.log('📊 Projects summary:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching projects summary:', error);
            throw error;
        }
    }

    // جلب جميع المشاريع
    async getAllProjects(filters?: ProjectFilters): Promise<Project[]> {
        try {
            const params: any = {};
            if (filters?.search) params.search = filters.search;
            if (filters?.status && filters.status !== 'all') params.status = filters.status;
            if (filters?.year && filters.year !== 'all') params.year = filters.year;
            
            const response = await this.api.get<PaginatedResponse<Project>>('/admin/dashboard/all-projects', { params });
            console.log('📚 Projects fetched:', response.data.data.length);

            return response.data.data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    // جلب تفاصيل مشروع محدد
    async getProjectDetails(id: string): Promise<Project> {
        try {
            const response = await this.api.get(`/admin/dashboard/${id}/details`);
            console.log('🔍 Project details fetched:', response.data.data.title);
            
            return response.data.data;
        } catch (error) {
            console.error('Error fetching project details:', error);
            throw error;
        }
    }

    // إنشاء مشروع جديد
    async createProject(data: Partial<Project>): Promise<Project> {
        const response = await this.api.post('/admin/dashboard/projects', data);
        return response.data.data;
    }

    // تحديث مشروع
    async updateProject(id: string, data: Partial<Project>): Promise<Project> {
        const response = await this.api.put(`/admin/dashboard/projects/${id}`, data);
        return response.data.data;
    }

    // حذف مشروع
    async deleteProject(id: string): Promise<boolean> {
        await this.api.delete(`/admin/dashboard/projects/${id}`);
        return true;
    }

    // جلب الدكاترة (للفلترة)
    async getDoctors(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/doctors');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }
    }

    // جلب الجامعات (للفلترة)
    async getUniversities(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/universities');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching universities:', error);
            return [];
        }
    }

    // جلب الأقسام (للفلترة)
    async getDepartments(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/departments');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            return [];
        }
    }
}

export default new ProjectService();