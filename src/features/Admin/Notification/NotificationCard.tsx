// src/components/admin/NotificationCard.tsx
import React from 'react';
// import { Notification } from '../../AdminTypes/Notification.interface';

interface Props {
    notification: any;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

export const NotificationCard: React.FC<Props> = ({ notification, onMarkAsRead, onDelete, loading }) => {
    const getIconByType = (type: string) => {
        switch (type) {
            case 'system': return 'settings';
            case 'user': return 'person';
            case 'project': return 'folder';
            default: return 'notifications';
        }
    };

    const getIconColorByType = (type: string) => {
        switch (type) {
            case 'system': return 'icon-system';
            case 'user': return 'icon-user';
            case 'project': return 'icon-project';
            default: return 'icon-default';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={`card-hover bg-white dark:bg-gray-800 rounded-xl p-5 border ${notification.isRead ? 'border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-900/10'} cursor-pointer transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-start gap-4">
                <div className={`notification-icon ${getIconColorByType(notification.type)} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="material-symbols-outlined text-white text-xl">{getIconByType(notification.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                {notification.title}
                                {!notification.isRead && (
                                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                )}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                {notification.sender && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-xs align-middle">person</span>
                                        {notification.sender.name}
                                    </span>
                                )}
                                {notification.project && (
                                    <span className="text-sm text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-xs align-middle">folder</span>
                                        {notification.project.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="time-badge text-gray-500 dark:text-gray-400 text-sm">
                                {formatDate(notification.createdAt)}
                            </span>
                            <div className="flex gap-1">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => onMarkAsRead(notification.id)}
                                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                                        title="تعليم كمقروء"
                                        disabled={loading}
                                    >
                                        <span className="material-symbols-outlined text-sm">done</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(notification.id)}
                                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
                                    title="حذف"
                                    disabled={loading}
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};