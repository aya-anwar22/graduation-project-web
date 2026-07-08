export interface TeamMember {
    memberId: string;
    memberFullName: string;
    memberEmail: string;
    memberBio?: string;
    memberPhone?: string;
    memberProfileImage: string | null;
    memberRole: string;
    memberIsLeader: boolean;
}

export interface TeamData {
    teamId: string;
    teamName: string;
    teamCode: string;
    projectId: string;
    doctorFullName: string;
    doctorEmail: string;
    doctorPhone: string;
    doctorImage: string;
    doctorBio: string;
    teamMembers: TeamMember[];
}

export interface TeamApiResponse {
    success: boolean;
    message: string;
    data: TeamData;
}

export interface TeamServiceError {
    success: false;
    message: string;
    error?: any;
}