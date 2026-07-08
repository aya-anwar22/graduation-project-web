// src/components/admin/NotificationFilters.tsx
import React from 'react';
// import { NotificationFilters as FiltersType } from '../../AdminTypes/Notification.interface';

interface Props {
    currentFilter: any['type'];
    onFilterChange: (filter: any['type']) => void;
    onDeleteAllRead: () => void;
    loading: boolean;
}

export const NotificationFilters: React.FC<Props> = ({
    currentFilter,
    onFilterChange,
    onDeleteAllRead,
    loading,
}) => {
    const filters = [
        { id: 'all', label: 'الكل', icon: 'notifications' },
        { id: 'unread', label: 'غير مقروءة', icon: 'mark_email_unread' },
        { id: 'system', label: 'النظام', icon: 'settings' },
        { id: 'user', label: 'المستخدمين', icon: 'person' },
    ];

    return (
        <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 flex-wrap flex-1">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id as any['type'])}
                            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                                currentFilter === filter.id
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                            disabled={loading}
                        >
                            <span className="material-symbols-outlined text-sm">{filter.icon}</span>
                            {filter.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onDeleteAllRead}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg font-semibold transition bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        حذف المقروءة
                    </button>
                </div>
            </div>
        </div>
    );
};