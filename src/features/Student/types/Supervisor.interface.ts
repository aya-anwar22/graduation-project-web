export interface Supervisor {
    id: string;
    name: string;
    department: string;
    email: string;
    specialization: string;
    maxTeams: number;
    currentTeams: number;
    bio: string;
    image: string;
}

export interface SupervisionRequestFormData {
    projectName: string;
    projectType: string;
    projectDescription: string;
    projectGoals: string;
    prerequisites: string;
    additionalNotes: string;
}

export interface SubmissionData {
    supervisor: string;
    supervisorInfo: Supervisor | null;
    projectName: string;
    projectType: string;
    projectDescription: string;
    projectGoals: string;
    prerequisites: string;
    additionalNotes: string;
    technologies: string[];
    teamMembers: TeamMember[];
}
// Done 🫡
export interface Department {
    _id: string;
    departmentName: string;
    universityId: {
        _id: string;
        universityName: string;
    };
}
// Done 🫡 
export interface Doctor {
    _id: string;
    fullName: string;
    email: string;
    profileImage: string;

    departments: {
        _id: string;
        departmentName: string;
    }[];
}


// Done 🫡 
export interface FormData {
    projectName: string;
    projectType: string;
    projectDescription: string;
    projectGoals: string;
    prerequisites: string;
    additionalNotes: string;
    year: string; // Added year field
}
// Done 🫡 

export interface TeamMember {
    full_name: string;
    university_number: string;
    role: string;
    contact_email: string;
    isLeader: boolean;
}
// Done 🫡 
export interface ApiSupervisionRequest {
    doctorId: string;
    departmentId: string;
    project_name: string;
    project_type: string;
    project_description: string;
    main_objectives: string;
    prerequisites?: string;
    additional_notes?: string;
    technologies: string[];
    year: string;
    team_members: TeamMember[];
}
// Done 🫡 
export interface TeamMemberUI {
    id: number;
    name: string;
    studentId: string;
    role: string;
    email: string;
    isLeader: boolean;
}
