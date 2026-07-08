// src/services/notification.service.ts
import axios, {type AxiosInstance } from 'axios';
// import { Notification, MarkAsReadResponse } from '../AdminTypes/Notification.interface';

class NotificationService {
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

    async getNotifications(): Promise<Notification[]> {
        try {
            const response = await this.api.get('/admin/dashboard/notifications');
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async markAsRead(id: string): Promise<any> {
        const response = await this.api.patch(`/admin/dashboard/notifications/${id}/read`);
        return response.data;
    }

    async markAllAsRead(): Promise<any> {
        const response = await this.api.patch('/admin/dashboard/notifications/mark-all-read');
        return response.data;
    }

    async deleteNotification(id: string): Promise<boolean> {
        await this.api.delete(`/admin/dashboard/notifications/${id}`);
        return true;
    }

    async deleteAllRead(): Promise<boolean> {
        await this.api.delete('/admin/dashboard/notifications/delete-read');
        return true;
    }

    async createNotification(data: Partial<Notification>): Promise<Notification> {
        const response = await this.api.post('/admin/dashboard/notifications', data);
        return response.data.data;
    }
}

export default new NotificationService();