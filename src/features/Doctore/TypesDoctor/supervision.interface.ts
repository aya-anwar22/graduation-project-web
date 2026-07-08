// TypesDoctor/supervision.interface.ts

export interface TeamMember {
    fullName: string;
    role: string;
    universityNumber: string;
    contactEmail: string;
    isLeader: boolean;
    profileImage: string;
}

export interface Request {
    studentId: string;
    studentName: string;
    projectImage: string | null;
    requestId: string;
    projectName: string;
    projectDescription: string;
    mainObjectives: string;
    year: string;
    projectType: string;
    technologies: string[];
    prerequisites: string;
    additionalNotes: string;
    status: 'pending' | 'approved' | 'rejected';
    departmentId: string;
    departmentName: string;
    universityId: string;
    universityName: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RequestDetails {
    requestId: string;
    projectName: string;
    projectDescription: string;
    mainObjectives: string;
    year: string;
    projectType: string;
    technologies: string[];
    prerequisites: string;
    additionalNotes: string;
    status: 'pending' | 'approved' | 'rejected';
    departmentId: string;
    departmentName: string;
    universityId: string;
    universityName: string;
    team: TeamMember[]; // الآن TeamMember معرّفة
    createdAt?: string;
    updatedAt?: string;
}

export interface RequestsResponse {
    success: boolean;
    message: string;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: Request[];
    timestamp: string;
}

export interface RequestDetailsResponse {
    success: boolean;
    message: string;
    data: RequestDetails;
    timestamp: string;
}

export interface UpdateStatusResponse {
    success: boolean;
    message: string;
    timestamp: string;
}

export interface FilterState {
    university: string;
    department: string;
    year: string;
}

export type TabType = 'pending' | 'rejected';
// TypesDoctor/supervision.interface.ts - أضف هذه الواجهة

export interface RequestStats {
    totalRequests: number;
    approvedRequests: number;
    pendingRequests: number;
    currentYearRequests: number;
    year: string;
}

export interface RequestStatsResponse {
    success: boolean;
    message: string;
    data: RequestStats;
    timestamp: string;
}