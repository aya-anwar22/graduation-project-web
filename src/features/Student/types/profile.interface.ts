export interface ApiStudentProfileResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: ApiStudentProfile;
}


export interface ApiStudentProfile {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    bio: string;
    profileImage: string;
    universityCode: string;

    departmentId: {
        _id: string;
        departmentName: string;
    };

    universityId: {
        _id: string;
        universityName: string;
    };

    createdAt: string;
    updatedAt: string;
}



export interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    bgColor: string;
}

export interface UpdateProfileDto {
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
    profileImage?: File | string;
}