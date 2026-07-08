// DoctorServices/supervisionService.ts
import type { RequestsResponse, RequestDetailsResponse, UpdateStatusResponse } from '../TypesDoctor/supervision.interface';

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

// جلب الطلبات المعلقة
export const getPendingRequests = async (status: string): Promise<RequestsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/supervision-requests/doctor/pending-requests?status=${status}`, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<RequestsResponse>(response);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        throw error;
    }
};

// جلب الطلبات المرفوضة
export const getRejectedRequests = async (status: string): Promise<RequestsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/supervision-requests/doctor/pending-requests?status=${status}`, {
            method: 'GET',
            headers: createHeaders(),
        });
        console.log("response", response);

        return await handleResponse<RequestsResponse>(response);
    } catch (error) {
        console.error('Error fetching rejected requests:', error);
        throw error;
    }
};
// دالة عامة لجلب الطلبات حسب الحالة
export const getRequestsByStatus = async (
    status: 'pending' | 'rejected' | 'approved',
): Promise<RequestsResponse> => {
    try {

        // بناء الرابط حسب الحالة
        let url = '';
        if (status === 'pending') {
            url = `${API_BASE_URL}/api/v1/supervision-requests/doctor/pending-requests?status=${status}`;
        } else if (status === 'rejected') {
            url = `${API_BASE_URL}/api/v1/supervision-requests/doctor/pending-requests?status=${status}`;
        } else {
            url = `${API_BASE_URL}/api/v1/supervision-requests/doctor/approved-requests?status=${status}`;
        }
        console.log(url);

        const response = await fetch(url, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<RequestsResponse>(response);
    } catch (error) {
        console.error(`Error fetching ${status} requests:`, error);
        throw error;
    }
};
// جلب تفاصيل الطلب
export const getRequestDetails = async (requestId: string): Promise<RequestDetailsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/supervision-requests/doctor/details/${requestId}`, {
            method: 'GET',
            headers: createHeaders(),
        });

        return await handleResponse<RequestDetailsResponse>(response);
    } catch (error) {
        console.error('Error fetching request details:', error);
        throw error;
    }
};

// تحديث حالة الطلب (قبول/رفض)
export const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<UpdateStatusResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/supervision-requests/doctor/update-status/${requestId}`, {
            method: 'PATCH',
            headers: createHeaders(),
            body: JSON.stringify({ status }),
        });

        return await handleResponse<UpdateStatusResponse>(response);
    } catch (error) {
        console.error('Error updating request status:', error);
        throw error;
    }
};
// DoctorServices/supervisionService.ts - أضف هذه الدالة

// جلب إحصائيات الطلبات
export const getRequestStats = async (): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/supervision-requests/doctor/request-stats`, {
            method: 'GET',
            headers: createHeaders(),
        });
        await getRejectedRequests("rejected")
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching request stats:', error);
        throw error;
    }
};