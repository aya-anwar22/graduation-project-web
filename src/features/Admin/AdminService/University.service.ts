// src/features/Admin/AdminService/University.service.ts
import axios, { type AxiosInstance } from 'axios';
import type { UniversityApiData, UniversityFormData } from '../AdminTypes/Universty.interface'

class UniversityService {
    private api: AxiosInstance;
    private baseURL = 'http://localhost:3000/api/v1';

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: { 'Content-Type': 'application/json' },
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async getUniversities(): Promise<UniversityApiData[]> {
        const response = await this.api.get('/admin/dashboard/all-universities');
        return response.data.data || [];
    }

    async createUniversity(data: UniversityFormData): Promise<UniversityApiData> {
        const response = await this.api.post('/admin/dashboard/universities', data);
        return response.data.data;
    }

    async updateUniversity(id: string, data: Partial<UniversityFormData>): Promise<UniversityApiData> {
        const response = await this.api.patch(`/admin/dashboard/universities/${id}`, data);
        return response.data.data;
    }

    async toggleUniversityStatus(id: string): Promise<{ success: boolean; message: string; isDeleted: boolean }> {
        const response = await this.api.delete(`/admin/dashboard/universities/${id}`);
        // التحقق من currentStatus في الـ response
        const isDeleted = response.data?.data?.currentStatus === 'Deleted' ||
            response.data?.currentStatus === 'Deleted';
        return {
            success: true,
            message: response.data?.message || (isDeleted ? 'تم حذف الجامعة' : 'تم استعادة الجامعة'),
            isDeleted
        };
    }
}


export default new UniversityService();