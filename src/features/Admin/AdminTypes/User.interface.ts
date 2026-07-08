// src/AdminTypes/User.interface.ts
export interface User {
    _id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'doctor' | 'student';
    isVerified: boolean;
    isDeleted: boolean;
    phoneNumber?: string;
    profileImage?: string | null;
    departmentId?: string;
    universityId?: string;
    universityName?: string;
    departmentName?: string;
    universityCode?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface UserStats {
    totalUsers: number;
    totalDoctors: number;
    totalStudents: number;
    verifiedUsers: number;
}

export interface UserFilters {
    search: string;
    role: string;
    university: string;
    department: string;
    status: string;
    page?: number;
    limit?: number;
}

export interface UpdateRoleData {
    role: 'admin' | 'doctor' | 'student';
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
    data: T[];
    timestamp: string;
}