// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import NotificationService from '../features/Admin/AdminService/Notification.service';
import type { Notification, NotificationStats, NotificationFilters } from '../features/Admin/AdminTypes/Notification.interface';


export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await NotificationService.getNotifications();
            // setNotifications(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحميل الإشعارات');
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await NotificationService.markAsRead(id);
            setSuccess('تم تعليم الإشعار كمقروء');
            await fetchNotifications();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تعليم الإشعار كمقروء');
            return false;
        } finally {
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchNotifications]);

    const markAllAsRead = useCallback(async () => {
        setLoading(true);
        try {
            await NotificationService.markAllAsRead();
            setSuccess('تم تعليم جميع الإشعارات كمقروءة');
            await fetchNotifications();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تعليم الإشعارات');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchNotifications]);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await NotificationService.deleteNotification(id);
            setSuccess('تم حذف الإشعار بنجاح');
            await fetchNotifications();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في حذف الإشعار');
            return false;
        } finally {
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchNotifications]);

    const deleteAllRead = useCallback(async () => {
        setLoading(true);
        try {
            await NotificationService.deleteAllRead();
            setSuccess('تم حذف جميع الإشعارات المقروءة');
            await fetchNotifications();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في حذف الإشعارات');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchNotifications]);

    const getStats = useCallback((): any => {
        return {
            total: notifications.length,
            unread: notifications.filter(n => !n.isRead).length,
            system: notifications.filter(n => n.type === 'system').length,
            user: notifications.filter(n => n.type === 'user').length,
        };
    }, [notifications]);

    const filterNotifications = useCallback((filters: any) => {
        if (filters.type === 'all') return notifications;
        if (filters.type === 'unread') return notifications.filter(n => !n.isRead);
        if (filters.type === 'system') return notifications.filter(n => n.type === 'system');
        if (filters.type === 'user') return notifications.filter(n => n.type === 'user');
        return notifications;
    }, [notifications]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // تحديث تلقائي كل 30 ثانية
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        success,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        getStats,
        filterNotifications,
        refetch: fetchNotifications,
    };
};