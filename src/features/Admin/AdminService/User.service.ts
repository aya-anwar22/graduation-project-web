// src/features/Admin/AdminService/User.service.ts
import axios, { type AxiosInstance } from 'axios';
import type { User, UserStats, UserFilters, UpdateRoleData, PaginatedResponse } from '../AdminTypes/User.interface';

class UserService {
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

    // جلب إحصائيات المستخدمين
    async getUsersStats(): Promise<UserStats> {
        try {
            const response = await this.api.get('/admin/dashboard/users-stats');
            console.log('📊 Users stats:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching users stats:', error);
            throw error;
        }
    }

    // جلب جميع المستخدمين
    async getAllUsers(filters?: UserFilters): Promise<User[]> {
        try {
            const params: any = {};
            if (filters?.search) params.search = filters.search;
            if (filters?.role && filters.role !== 'all') params.role = filters.role;
            if (filters?.status === 'verified') params.isVerified = true;
            if (filters?.status === 'unverified') params.isVerified = false;
            
            const response = await this.api.get<PaginatedResponse<User>>('/admin/dashboard/manage-users', { params });
            console.log('👥 Users fetched:', response.data.data.length);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // جلب تفاصيل مستخدم محدد
    async getUserDetails(id: string): Promise<User> {
        try {
            const response = await this.api.get(`/admin/dashboard/user-details/${id}`);
            console.log('🔍 User details fetched:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    }

    // تحديث دور المستخدم
    async updateUserRole(id: string, role: string): Promise<User> {
        try {
            const response = await this.api.patch(`/admin/dashboard/update-role/${id}`, { role });
            console.log('👤 User role updated:', response.data.data.fullName, '->', role);
            return response.data.data;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }

    // حذف/استعادة مستخدم (تغيير الحالة)
    async toggleUserStatus(id: string): Promise<User> {
        try {
            const response = await this.api.post(`/admin/dashboard/toggle-status/${id}`);
            console.log('🔄 User status toggled:', response.data.data.fullName);
            return response.data.data;
        } catch (error) {
            console.error('Error toggling user status:', error);
            throw error;
        }
    }

    // إنشاء مستخدم جديد
    async createUser(data: any): Promise<User> {
        const response = await this.api.post('/admin/dashboard/creatuser', data);
        return response.data.data;
    }

    // تحديث بيانات مستخدم
    async updateUser(id: string, data: Partial<any>): Promise<User> {
        const response = await this.api.patch(`/admin/dashboard/users/${id}`, data);
        return response.data.data;
    }

    // حذف مستخدم نهائياً
    async deleteUser(id: string): Promise<boolean> {
        await this.api.delete(`/admin/dashboard/users/${id}`);
        return true;
    }

    // جلب الجامعات للفلترة
    async getUniversities(): Promise<any[]> {
        try {
            const response = await this.api.get('/admin/dashboard/universities');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching universities:', error);
            return [];
        }
    }

    // ✅ جلب الأقسام حسب الجامعة (جديد)
    async getDepartmentsByUniversity(universityId: string): Promise<any[]> {
        if (!universityId) return [];
        try {
            const response = await this.api.get(`/admin/dashboard/departments/${universityId}`);
            console.log('📚 Departments for university:', response.data);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching departments by university:', error);
            return [];
        }
    }

    // جلب جميع الأقسام (للفلترة العامة)
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

export default new UserService();