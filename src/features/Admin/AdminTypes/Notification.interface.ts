// src/AdminTypes/Notification.interface.ts
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'system' | 'user' | 'project';
    isRead: boolean;
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        role?: string;
    };
    project?: {
        id: string;
        name: string;
    };
    actionUrl?: string;
}

export interface NotificationStats {
    total: number;
    unread: number;
    system: number;
    user: number;
}

export interface NotificationFilters {
    type: 'all' | 'unread' | 'system' | 'user';
}

export interface MarkAsReadResponse {
    success: boolean;
    message: string;
}