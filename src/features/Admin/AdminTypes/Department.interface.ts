// src/features/Admin/AdminTypes/Department.interface.ts
export interface DepartmentStats {
    doctorsCount: number;
    requestsCount: number;
    projectsCount: number;
    totalDepartments:number
}

export interface Department {
    id: string;
    departmentName: string;
    universityId: string;
    universityName: string;
    headDoctorId: string;
    headDoctorName: string;
    status: 'active' | 'deleted';
    doctors: number;
    students: number;
    projects: number;
    requests: number;
    stats?: DepartmentStats;
    icon?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DepartmentFormData {
    departmentName: string;
    universityId: string;
    headDoctorId: string;
}

export interface DepartmentApiData {
    _id: string;
    departmentName: string;
    universityId?: string;
    universityName?: string;
    headDoctorId?: string;
    headDoctorName?: string;
    isDeleted?: boolean;
    doctorsCount?: number;
    studentsCount?: number;
    projectsCount?: number;
    requestsCount?: number;
    stats?: DepartmentStats;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    headId?: string;
    headName?: string;
}

export interface DepartmentStatsType {
    totalDepartments: number;
    activeDepartments: number;
    totalDoctors: number;
    headDepartments: number;
}

export interface DepartmentFilters {
    search: string;
    status: string;
    universityId: string;
}