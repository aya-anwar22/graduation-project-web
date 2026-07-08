// TypesDoctor/homeDoctor.interfase.ts

export interface Project {
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    projectYear: string;
    projectStatus: 'start' | 'in_progress' | 'completed';
    projectImage: string | null;
    projectType: string;
    departmentId: string;
    departmentName: string;
    universityId: string;
    universityName: string;
    technologies: string[];
    // للعرض
    id?: string;
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    department?: string;
    university?: string;
    status?: 'featured' | 'pending' | 'completed';
    year?: string;
    team?: string;
}

export interface ProjectsResponse {
    success: boolean;
    message: string;
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
    data: Project[];
    timestamp: string;
}

export interface DashboardStats {
    totalProjects: number;
    pendingActions: number;
    completedProjects: number;
    totalTeams: number;
    featuredProjects: number;
    currentYearProjects: number;
    year: string;
}

export interface DashboardStatsResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        stats: DashboardStats;
    };
    timestamp: string;
}