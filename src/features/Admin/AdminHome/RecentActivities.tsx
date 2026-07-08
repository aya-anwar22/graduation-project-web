// src/components/admin/dashboard/RecentActivities.tsx
import React from 'react';
// import { RecentActivity } from '../../../AdminTypes/Dashboard.interface';

interface Props {
    activities: any[];
}

export const RecentActivities: React.FC<Props> = ({ activities }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'project': return 'folder';
            case 'user': return 'person_add';
            case 'request': return 'request_quote';
            case 'notification': return 'notifications';
            default: return 'info';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'project': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
            case 'user': return 'bg-green-100 dark:bg-green-900/30 text-green-600';
            case 'request': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600';
            case 'notification': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600';
        }
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return null;
        switch (status) {
            case 'pending':
                return <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">معلق</span>;
            case 'approved':
                return <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">موافق</span>;
            case 'rejected':
                return <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs">مرفوض</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 animate-slide-in">
            <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">history</span>
                    آخر النشاطات
                </h2>
            </div>
            <div className="p-4 lg:p-6">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                <span className="material-symbols-outlined text-sm">{getActivityIcon(activity.type)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {activity.title}
                                    </p>
                                    {getStatusBadge(activity.status)}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    {activity.description}
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};