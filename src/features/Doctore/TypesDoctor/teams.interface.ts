// types/team.types.ts

export interface TeamMember {
    userId: string;
    role: string;
    fullName: string;
    profileImage: string;
}

export interface TeamDetails {
    _id: string;
    teamName: string;
    teamCode: string;
    projectTitle: string;
    projectDescription: string;
    projectStatus: 'start' | 'in_progress' | 'completed';
    projectYear: string;
    universityId: string;
    universityName: string;
    departmentId: string;
    departmentName: string;
    members: TeamMember[];
}

export interface Team {
    _id: string;
    teamName: string;
    teamCode: string;
    projectStatus: 'start' | 'in_progress' | 'completed';
    projectYear: string;
    universityId: string;
    universityName: string;
    departmentId: string;
    departmentName: string;
}

export interface TeamsResponse {
    success: boolean;
    message: string;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: Team[];
    timestamp: string;
}

export interface TeamStatsResponse {
    success: boolean;
    message: string;
    data: {
        totalTeams: number;
        totalMembers: number;
        activeTeams: number;
        completedProjects: number;
    };
    timestamp: string;
}

export interface TeamDetailsResponse {
    success: boolean;
    message: string;
    data: TeamDetails;
    timestamp: string;
}

export interface FilterState {
    status: string;
    university: string;
}

export type ProjectStatus = 'start' | 'in_progress' | 'completed';

export const StatusLabels: Record<ProjectStatus, string> = {
    'start': 'بداية',
    'in_progress': 'قيد التنفيذ',
    'completed': 'مكتملة'
};

export const StatusColors: Record<ProjectStatus, { bg: string; text: string }> = {
    'start': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
    'in_progress': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    'completed': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' }
};