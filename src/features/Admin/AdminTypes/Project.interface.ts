// src/AdminTypes/Project.interface.ts
export interface ProjectFile {
    filename: string;
    filepath: string;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    year: string;
    status: 'start' | 'in_progress' | 'completed' | 'paused';
    createdAt: string;
    projectLink?: string;
    projectImage?: string;
    technologies: string[];
    doctorName: string;
    doctorId: string;
    departmentName: string;
    departmentId: string;
    universityName: string;
    universityId: string;
    membersCount?: number;
    membersNames?: string[];
    files?: ProjectFile[];
}

export interface ProjectSummary {
    projectTotal: number;
    projectActive: number;
    projectCompleted: number;
    projectThisYear: number;
}

export interface ProjectStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    thisYearProjects: number;
}

export interface ProjectFilters {
    search: string;
    status: string;
    doctor: string;
    university: string;
    department: string;
    year: string;
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