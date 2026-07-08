// src/features/Student/types/project.types.ts
export interface ProjectStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    supervisionRequests: number;
}

export interface Project {
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    projectYear: string;
    projectStatus: 'start' | 'in-progress' | 'completed';
    projectLink: string | null;
    projectImage: string | null;
    projectType: 'web' | 'mobile' | 'desktop';
    projectMainObjectives: string;
    doctorFullName: string;
    doctorEmail: string;
    doctorPhone: string;
    doctorImage: string | null;
    doctorBio: string | null;
    departmentName: string;
    universityName: string;
    teamName: string;
    teamCode: string;
    teamMembers: TeamMember[];
    technologies: string[];
    files: any[];
    rating?: number;
    duration?: string;
    date?: string;
    category?: string;
}

export interface TeamMember {
    memberId: string;
    memberFullName: string;
    memberEmail: string;
    memberPhone: string | null;
    memberProfileImage: string | null;
    memberRole: string;
    memberIsLeader: boolean;
}

export interface ProjectsApiResponse {
    success: boolean;
    message: string;
    stats: {
        totalProjects: number;
        completedProjects: number;
        currentYearProjects: number;
    };
    meta: {
        totalPages: number;
        currentPage: number;
    };
    data: Project[];
    timestamp: string;
}

export interface ProjectFilters {
    search: string;
    status: string;
    type: string;
    year: string;
    category: string;
}

export interface ProjectCardProps {
    project: Project;
    onViewDetails: (projectId: string) => void;
}