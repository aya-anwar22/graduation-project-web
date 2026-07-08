// src/AdminTypes/Profile.interface.ts
export interface AdminProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'super_admin';
    status: 'active' | 'inactive';
    isVerified: boolean;
    avatar?: string;
    joinDate: string;
    lastPasswordChange: string;
    twoFactorEnabled: boolean;
    stats: {
        universities: number;
        departments: number;
        doctors: number;
        students: number;
    };
}

export interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface BackupData {
    success: boolean;
    message: string;
    downloadUrl?: string;
}