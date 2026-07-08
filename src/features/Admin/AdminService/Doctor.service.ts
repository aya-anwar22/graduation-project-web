// src/AdminService/Doctor.service.ts
import axios from 'axios';
import type { Doctor, DoctorFilters, DoctorsStatsResponse, PaginatedResponse } from '../AdminTypes/Doctor.interface';

const API_BASE_URL = 'http://localhost:3000/api/v1/admin/dashboard';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor لإضافة التوكن
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

export const doctorService = {
    // جلب إحصائيات الدكاترة
    getStats: async (): Promise<DoctorsStatsResponse> => {
        try {
            const { data } = await api.get('/doctors-stats');
            console.log('📊 Doctors stats:', data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching doctors stats:', error);
            throw error;
        }
    },

    // جلب جميع الدكاترة مع تفاصيلهم
    getAll: async (filters: DoctorFilters): Promise<Doctor[]> => {
        try {
            const params: any = {};
            if (filters.search) params.search = filters.search;
            if (filters.departmentId) params.departmentId = filters.departmentId;
            if (filters.status) params.status = filters.status;
            
            const { data } = await api.get<PaginatedResponse<Doctor>>('/all-doctors-detailed', { params });
            console.log('👨‍⚕️ Doctors fetched:', data.data.length);
            return data.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    // جلب تفاصيل دكتور معين
    getById: async (id: string): Promise<Doctor> => {
        try {
            const { data } = await api.get(`/doctor-profile/${id}`);
            console.log('👨‍⚕️ Doctor fetched:', data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            throw error;
        }
    },

    // حذف دكتور (تغيير الحالة)
    delete: async (id: string): Promise<void> => {
        try {
            await api.post(`/toggle-status/${id}`);
            console.log('🗑️ Doctor deleted/restored:', id);
        } catch (error) {
            console.error('Error toggling doctor status:', error);
            throw error;
        }
    },

    // استعادة دكتور (نفس التوجع)
    restore: async (id: string): Promise<void> => {
        try {
            await api.post(`/toggle-status/${id}`);
            console.log('🔄 Doctor restored:', id);
        } catch (error) {
            console.error('Error restoring doctor:', error);
            throw error;
        }
    },

    // إلغاء منصب رئيس القسم
    removeHead: async (id: string): Promise<void> => {
        try {
            await api.delete(`/doctors/${id}/head`);
            console.log('👑 Doctor head role removed:', id);
        } catch (error) {
            console.error('Error removing head role:', error);
            throw error;
        }
    },

    // جلب الدكاترة حسب الجامعة (للاستخدام في الأقسام)
    getDoctorsByUniversity: async (universityId: string): Promise<Doctor[]> => {
        try {
            const { data } = await api.get(`/doctors?universityId=${universityId}`);
            return data.data || [];
        } catch (error) {
            console.error('Error fetching doctors by university:', error);
            return [];
        }
    },
};