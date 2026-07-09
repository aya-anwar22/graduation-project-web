// src/features/Admin/AdminService/Team.service.ts
import axios, { type AxiosInstance } from 'axios';
import type { Team, TeamStatistics, PaginatedResponse } from '../AdminTypes/Team.interface';

class TeamService {
    private api: AxiosInstance;
    private baseURL =import.meta.env.VITE_API_URL;

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

    // جلب إحصائيات الفرق
    async getTeamsStatistics(): Promise<TeamStatistics> {
        try {
            const response = await this.api.get('/admin/dashboard/teams-statistics');
            console.log('📊 Teams statistics:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching teams statistics:', error);
            throw error;
        }
    }

    // جلب جميع الفرق مع التفاصيل
    async getAllTeams(filters?: any): Promise<Team[]> {
        try {
            const params: any = {};
            if (filters?.search) params.search = filters.search;
            if (filters?.year && filters.year !== 'all') params.year = filters.year;
            
            const response = await this.api.get<PaginatedResponse<Team>>('/admin/dashboard/all-teams-detailed', { params });
            console.log('👥 Teams fetched:', response.data.data.length);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    // جلب تفاصيل فريق محدد
    async getTeamDetails(id: string): Promise<Team> {
        try {
            const response = await this.api.get(`/admin/dashboard/team-details/${id}`);
            console.log('🔍 Team details fetched:', response.data.data.teamName);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching team details:', error);
            throw error;
        }
    }

    // إنشاء فريق جديد
    async createTeam(data: any): Promise<Team> {
        const response = await this.api.post('/admin/dashboard/teams', data);
        return response.data.data;
    }

    // تحديث فريق
    async updateTeam(id: string, data: Partial<any>): Promise<Team> {
        const response = await this.api.put(`/admin/dashboard/teams/${id}`, data);
        return response.data.data;
    }

    // حذف فريق
    async deleteTeam(id: string): Promise<boolean> {
        await this.api.delete(`/admin/dashboard/teams/${id}`);
        return true;
    }

    // جلب المشرفين (الدكاترة) للفلترة
    async getSupervisors(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/doctors');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching supervisors:', error);
            return [];
        }
    }

    // جلب الطلاب
    async getStudents(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/students');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    }

    // جلب الجامعات
    async getUniversities(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/universities');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching universities:', error);
            return [];
        }
    }

    // جلب الأقسام
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

export default new TeamService();