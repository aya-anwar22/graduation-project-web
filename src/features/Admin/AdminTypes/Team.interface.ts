// src/AdminTypes/Team.interface.ts
export interface TeamMember {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
}

export interface Team {
    _id: string;
    teamName: string;
    teamCode: string;
    projectName: string;
    projectYear: string;
    projectStatus?: string;
    doctorId: string;
    doctorName: string;
    leaderId?: string;
    leaderName: string;
    membersCount: number;
    membersNames: string[];
    membersDetails?: TeamMember[];
}

export interface TeamStatistics {
    totalTeams: number;
    activeTeams: number;
    totalMembers: number;
    thisYearTeams: number;
}

export interface TeamFilters {
    search: string;
    supervisor: string;
    year: string;
    department: string;
    university: string;
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