// src/components/admin/NotificationStats.tsx
import React from 'react';
// import { NotificationStats as StatsType } from '../../AdminTypes/Notification.interface';

interface Props {
    stats: any;
}

export const NotificationStats: React.FC<Props> = ({ stats }) => {
    const statsCards = [
        { title: 'جميع الإشعارات', value: stats.total, icon: 'notifications', color: 'from-blue-500 to-blue-600' },
        { title: 'غير مقروءة', value: stats.unread, icon: 'mark_email_unread', color: 'from-red-500 to-red-600' },
        { title: 'إشعارات النظام', value: stats.system, icon: 'settings', color: 'from-purple-500 to-purple-600' },
        { title: 'إشعارات المستخدمين', value: stats.user, icon: 'person', color: 'from-green-500 to-green-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {statsCards.map((card, index) => (
                <div key={index} className={`card-hover bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm font-medium">{card.title}</p>
                            <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg">
                            <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};