// DoctorServices/studentsService.ts
import type { StudentsResponse, StudentSummaryResponse, StudentDetailsResponse } from '../TypesDoctor/students.interface';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// الحصول على التوكن
const getToken = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    
    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) return sessionToken;
    
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

// دالة مساعدة للتعامل مع الاستجابات
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
    
    const data = await response.json();
    return data;
};

// جلب ملخص الطلاب
export const getStudentSummary = async (): Promise<StudentSummaryResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/doctor-specialization/student-summary`, {
            method: 'GET',
            headers: createHeaders(),
        });
        
        return await handleResponse<StudentSummaryResponse>(response);
    } catch (error) {
        console.error('Error fetching student summary:', error);
        throw error;
    }
};

// جلب قائمة الطلاب
export const getStudents = async (page: number = 1, limit: number = 10): Promise<StudentsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/doctor-specialization/my-students?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: createHeaders(),
        });
        
        return await handleResponse<StudentsResponse>(response);
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// جلب تفاصيل طالب محدد
export const getStudentDetails = async (studentId: string): Promise<StudentDetailsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/doctor-specialization/student-details/${studentId}`, {
            method: 'GET',
            headers: createHeaders(),
        });
        
        return await handleResponse<StudentDetailsResponse>(response);
    } catch (error) {
        console.error('Error fetching student details:', error);
        throw error;
    }
};

// إرسال رسالة جماعية
export const sendBulkMessage = async (studentIds: string[], message: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/send-bulk-message`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({ studentIds, message }),
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error sending bulk message:', error);
        throw error;
    }
};

// إضافة ملاحظة لطالب
export const addStudentNote = async (studentId: string, note: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/student/${studentId}/notes`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify({ note }),
        });
        
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding student note:', error);
        throw error;
    }
};