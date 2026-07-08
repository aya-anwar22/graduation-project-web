// TypesDoctor/projects.interface.ts

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

export interface ProjectStatsResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        stats: {
            totalProjects: number;
            pendingActions: number;
            completedProjects: number;
            totalTeams: number;
            featuredProjects: number;
            currentYearProjects: number;
            year: string;
        };
    };
    timestamp: string;
}

export interface FilterState {
    status: string;
    year: string;
    technology: string;
}

export const StatusLabels: Record<string, string> = {
    'start': 'مكتمل',
    'in_progress': 'قيد التنفيذ',
    'completed': 'مكتمل'
};

export const StatusColors: Record<string, { bg: string; text: string }> = {
    'start': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    'in_progress': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
    'completed': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' }
};