// types/home.interface.ts
export interface ProjectStatsData {
    totalProjects: number;
    completedProjects: number;
    currentYearProjects: number;
    inProgressProjects?: number;
}

export interface ProjectStatsApiResponse {
    success: boolean;
    message: string;
    data: ProjectStatsData;
}

export interface ProjectStatsServiceError {
    success: false;
    message: string;
    error?: any;
}

export interface TeamMember {
    memberId: string;
    memberFullName: string;
    memberEmail: string;
    memberBio: string;
    memberPhone: string;
    memberProfileImage: string;
    memberRole: string;
    memberIsLeader: boolean;
}

export interface ProjectFile {
    fileId: string;
    fileName: string;
    filePath: string;
}

export interface ProjectData {
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    projectYear: string;
    projectStatus: 'start' | 'in-progress' | 'completed' | 'pending';
    projectLink: string | null;
    projectImage: string | null;
    projectType: string;
    projectMainObjectives: string;
    doctorFullName: string;
    doctorEmail: string;
    doctorPhone: string;
    doctorImage: string;
    doctorBio: string;
    departmentName: string;
    universityName: string;
    teamName: string;
    teamCode: string;
    teamMembers: TeamMember[];
    technologies: string[];
    files: ProjectFile[];
}

export interface ActiveProjectApiResponse {
    success: boolean;
    message: string;
    data: ProjectData;
}

export interface ActiveProjectServiceError {
    success: false;
    message: string;
    error?: any;
}

export interface ProjectsListApiResponse {
    success: boolean;
    message: string;
    stats?: ProjectStatsData;
    meta: {
        totalPages: number;
        currentPage: number;
    };
    data: ProjectData[];
    timestamp?: string;
}

export interface ProjectsListServiceError {
    success: false;
    message: string;
    error?: any;
}


