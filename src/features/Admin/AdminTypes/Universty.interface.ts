// src/types/university.types.ts
export interface University {
    id: string;
    name: string;
    location: string;
    email: string;
    status: 'active' | 'deleted';
    departments: number;
    doctors: number;
    projects: number;
    logo: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UniversityFormData {
    universityName: string;
    location: string;
    contactEmail: string;
}

export interface UniversityApiData {
    _id: string;
    universityName: string;
    location: string;
    contactEmail: string;
    isDeleted?: boolean;        // من الـ API
    currentStatus?: string;     // من الـ API
    departmentsCount?: number;
    doctorsCount?: number;
    projectsCount?: number;
}

export interface StatsData {
    totalUniversities: number;
    totalDepartments: number;
    totalDoctors: number;
    totalProjects: number;
}

export type UniversityStatus = 'active' | 'deleted';