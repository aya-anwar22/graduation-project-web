// src/AdminTypes/Dashboard.interface.ts
export interface DashboardStats {
    universities: number;
    departments: number;
    doctors: number;
    students: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingRequests: number;
}

export interface UniversityProjectStats {
    universityName: string;
    projectCount: number;
}

export interface ApiProjectByUniversity {
    universityName: string;
    projectCount: number;
}

export interface DashboardApiResponse {
    stats: DashboardStats;
    projectsByUniversity: UniversityProjectStats[];
}