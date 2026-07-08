// src/services/dashboard.service.ts
import axios, {type AxiosInstance } from 'axios';
import type { DashboardStats, UniversityProjectStats } from '../AdminTypes/Home.interface';

class DashboardService {
    private api: AxiosInstance;
    private baseURL = 'http://localhost:3000/api/v1';

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

    // جلب إحصائيات لوحة التحكم
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await this.api.get('/admin/dashboard/stats');
            console.log('📊 Dashboard stats:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    // جلب توزيع المشاريع حسب الجامعات
    async getProjectsByUniversity(): Promise<UniversityProjectStats[]> {
        try {
            const response = await this.api.get('/admin/dashboard/projects-by-university');
            console.log('🏫 Projects by university:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching projects by university:', error);
            throw error;
        }
    }
}

export default new DashboardService();