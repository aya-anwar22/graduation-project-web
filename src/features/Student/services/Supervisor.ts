// src/features/Doctor/DoctorServices/Supervisor.ts
import type { Doctor, Department } from "../types/Supervisor.interface";
import { api } from "./axiosInstance";

// ✅ جلب جميع الأقسام
export const getDepartments = async (): Promise<Department[]> => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('❌ No access token found');
            return [];
        }

        const response = await api.get('/departments', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📥 Departments response:', response.data);

        let departments: Department[] = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
            departments = response.data.data;
        } else if (Array.isArray(response.data)) {
            departments = response.data;
        } else {
            departments = [];
        }

        console.log(`✅ Loaded ${departments.length} departments`);
        return departments;
    } catch (error) {
        console.error('❌ Error fetching departments:', error);
        return [];
    }
};

// ✅ جلب الدكاترة حسب القسم - المسار الصحيح
export const getDoctorsByDepartment = async (departmentId: string): Promise<Doctor[]> => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('❌ No access token found');
            return [];
        }

        if (!departmentId) {
            console.warn('⚠️ No departmentId provided');
            return [];
        }

        console.log(`📤 Fetching doctors for department: ${departmentId}`);

        // ✅ المسار الصحيح: /doctors/{departmentId}
        const response = await api.get(`users/doctors/${departmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('📥 Doctors response:', response.data);

        let doctors: Doctor[] = [];
        if (response.data?.data && Array.isArray(response.data.data)) {
            doctors = response.data.data;
        } else if (Array.isArray(response.data)) {
            doctors = response.data;
        } else {
            doctors = [];
        }

        console.log(`✅ Loaded ${doctors.length} doctors for department`);
        return doctors;
    } catch (error: any) {
        console.error(`❌ Error fetching doctors for department ${departmentId}:`, error);
        
        // ✅ إذا كان الخطأ 404، نرجع مصفوفة فاضية بدل ما نرمي خطأ
        if (error.response?.status === 404) {
            console.warn(`⚠️ No doctors found for department ${departmentId}`);
            return [];
        }
        
        throw error;
    }
};