// TypesDoctor/projectDetails.interface.ts

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
    fileId?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    fileUrl?: string;
}

export interface ProjectDetails {
    projectId: string;
    projectTitle: string;
    projectDescription: string;
    projectYear: string;
    projectStatus: 'start' | 'in_progress' | 'completed';
    projectLink: string | null;
    projectImage: string | null;
    projectType: string;
    projectMainObjectives: string;
    doctorFullName: string;
    doctorEmail: string;
    doctorPhone: string;
    doctorImage: string;
    doctorBio: string;
    departmentId: string;
    departmentName: string;
    universityId: string;
    universityName: string;
    teamName: string;
    teamCode: string;
    teamMembers: TeamMember[];
    technologies: string[];
    files: ProjectFile[];
    isFeatured?: boolean; // ✅ أضف هذا الحقل

}

export interface ProjectDetailsResponse {
    success: boolean;
    message: string;
    data: ProjectDetails[];
    timestamp: string;
}

export const StatusLabels: Record<string, string> = {
    'start': 'مكتمل',
    'in_progress': 'قيد التنفيذ',
    'completed': 'مكتمل'
};

export const StatusColors: Record<string, { bg: string; text: string }> = {
    'start': { bg: 'bg-blue-200 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    'in_progress': { bg: 'bg-orange-200 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
    'completed': { bg: 'bg-green-200 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' }
};