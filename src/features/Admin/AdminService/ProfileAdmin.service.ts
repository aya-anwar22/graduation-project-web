// src/services/profile.service.ts
import axios, { type AxiosInstance } from 'axios';
// import { AdminProfile, ProfileFormData, ChangePasswordData, BackupData } from '../AdminTypes/Profile.interface';

class ProfileService {
    private api: AxiosInstance;
    private baseURL = 'http://localhost:3000/api/v1';

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async getProfile(): Promise<any> {
        try {
            const response = await this.api.get('/users/profile');
            console.log('profile response:', response.data)
            return response.data.data;

        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    // async updateProfile(data: any): Promise<any> {
    //     const response = await this.api.put('/users/profile', data);
    //     return response.data.data;
    // }

    // async uploadAvatar(file: File): Promise<{ data: any }> {
    //     const formData = new FormData();
    //     formData.append('avatar', file);
    //     const response = await this.api.patch('/users/profile', formData, {
    //         headers: {

    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //     return response.data.data;
    // }
    async uploadAvatar(file: File): Promise<{ profileImage: string }> {
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await this.api.patch('/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Avatar uploaded:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    }
    async updateProfile(data: any): Promise<any> {
        try {
            const response = await this.api.put('/users/profile', data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
    async changePassword(data: any): Promise<{ message: string }> {
        const response = await this.api.post('/users/profile/change-password', data);
        return response.data;
    }

    async toggleTwoFactor(): Promise<{ enabled: boolean }> {
        const response = await this.api.post('/users/profile/two-factor');
        return response.data.data;
    }

    async backupData(): Promise<any> {
        const response = await this.api.post('/users/profile/backup');
        return response.data;
    }

    async exportData(): Promise<Blob> {
        const response = await this.api.get('/users/profile/export', {
            responseType: 'blob',
        });
        return response.data;
    }

    async deleteAccount(): Promise<{ message: string }> {
        const response = await this.api.delete('/users/profile');
        return response.data;
    }
}

export default new ProfileService();