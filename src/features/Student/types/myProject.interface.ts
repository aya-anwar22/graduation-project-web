// types/project.ts

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
    projectStatus: "completed" | "pending" | "in-progress";
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

export interface ProjectResponse {
    success: boolean;
    message: string;
    data: ProjectData;
    timestamp: string;
}
