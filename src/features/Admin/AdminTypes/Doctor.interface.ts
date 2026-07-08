// src/AdminTypes/Doctor.interface.ts
export interface DoctorDepartment {
    departmentName: string;
    departmentId: string;
    isHead: boolean;
}

export interface DoctorStats {
    projectsCount: number;
    teamsCount: number;
    studentsCount: number;
}

export interface Doctor {
    _id: string;
    id?: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string | null;
    isDeleted: boolean;
    academicTitle?: string;
    academicDegree?: string;
    departments: DoctorDepartment[];
    stats: DoctorStats;
    status?: 'active' | 'deleted';
}

export interface DoctorsStatsResponse {
    totalDoctors: number;
    activeDoctors: number;
    inactiveDoctors: number;
    departmentHeads: number;
}

export interface DoctorFilters {
    search: string;
    departmentId: string;
    headFilter: string;
    title: string;
    status: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
    data: T[];
    timestamp: string;
}