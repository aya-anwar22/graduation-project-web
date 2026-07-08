// TypesDoctor/students.interface.ts

export interface Student {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    phoneNumber: string;
    profileImage: string | null;
    universityCode: string;
    bio: string;
    universityName: string;
    departmentName: string;
    projectId: string;
    projectName: string;
    projectYear: string;
}

export interface StudentDetailsResponse {
    success: boolean;
    message: string;
    data: Student;
    timestamp: string;
}

export interface StudentsResponse {
    success: boolean;
    message: string;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: Student[];
    timestamp: string;
}

export interface StudentSummaryResponse {
    success: boolean;
    message: string;
    data: {
        totalStudents: number;
        activeStudents: number;
        totalTeams: number;
        activeProjects: number;
    };
    timestamp: string;
}

export interface FilterState {
    university: string;
    status: string;
}