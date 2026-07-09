// src/features/Admin/AdminService/Department.service.ts
import type { AxiosInstance } from "axios";
import axios from "axios";
import type { DepartmentFormData, DepartmentApiData } from "../AdminTypes/Department.interface";

class DepartmentService {
    private api: AxiosInstance;
    private baseURL = import.meta.env.VITE_API_URL;

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

    // جلب جميع الأقسام
    async getDepartments(): Promise<DepartmentApiData[]> {
        try {
            const response = await this.api.get('/admin/dashboard/all-department');
            if (response.data.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    // ✅ جلب الأقسام حسب الجامعة (جديد)
    async getDepartmentsByUniversity(universityId: string): Promise<DepartmentApiData[]> {
        if (!universityId) return [];
        try {
            console.log('🏫 Fetching departments for university:', universityId);
            const response = await this.api.get(`/admin/dashboard/departments/${universityId}`);
            console.log('📚 Departments by university response:', response.data);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching departments by university:', error);
            return [];
        }
    }

    // إنشاء قسم جديد
    async createDepartment(data: DepartmentFormData): Promise<DepartmentApiData> {
        const payload = {
            departmentName: data.departmentName,
            universityId: data.universityId,
            headDoctorId: data.headDoctorId
        };
        const response = await this.api.post('/admin/dashboard/create-department', payload);
        return response.data.data || response.data;
    }

    // تحديث قسم
    async updateDepartment(id: string, data: Partial<DepartmentFormData>): Promise<DepartmentApiData> {
        const response = await this.api.patch(`/admin/dashboard/departments/${id}`, data);
        
        return response.data.data;
    }

    // تبديل حالة القسم (حذف/استعادة)
    async toggleDepartmentStatus(id: string): Promise<{ success: boolean; message: string; isDeleted: boolean }> {
        const response = await this.api.delete(`/admin/dashboard/departments/${id}`);
        const isDeleted = response.data?.data?.currentStatus === 'Deleted' || response.data?.currentStatus === 'Deleted';
        return {
            success: true,
            message: response.data?.message || (isDeleted ? 'تم حذف القسم' : 'تم استعادة القسم'),
            isDeleted
        };
    }

    // جلب قائمة الدكاترة حسب الجامعة
    async getDoctorsByUniversity(universityId: string): Promise<any[]> {
        if (!universityId) return [];
        const response = await this.api.get(`/admin/dashboard/doctors-by-university/${universityId}`);
        return response.data.data || [];
    }

    // جلب جميع الجامعات
    async getUniversities(): Promise<any[]> {
        const response = await this.api.get('/admin/dashboard/universities-list');
        return response.data.data || [];
    }
}

export default new DepartmentService();