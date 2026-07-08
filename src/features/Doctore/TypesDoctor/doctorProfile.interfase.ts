export interface AcademicInfo {
    academicDegree: string;
    academicTitle: string;
    specialization: string[];
    yearsOfExperience: number;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorProfileData {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    phoneNumber: string;
    bio: string;
    profileImage: string;
    academicInfo: AcademicInfo;
    isDeleted: boolean;
}

export interface UpdateDoctorProfileData {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    profileImage?: File | string;
    academicInfo?: {
        academicDegree?: string;
        academicTitle?: string;
        specialization?: string[];
        yearsOfExperience?: number;
    };
}

export interface ProfileStats {
    totalProjects: number;
    totalStudents: number;
    totalTeams: number;
    pendingRequests: number;
}

export interface Specialization {
    id: number;
    name: string;
    color: string;
    bgColor: string;
    darkBgColor: string;
    value: string;
}