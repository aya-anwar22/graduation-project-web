// src/components/admin/TeamStats.tsx
import React from 'react';

interface Props {
    stats: {
        totalTeams: number;
        activeTeams: number;
        totalMembers: number;
        thisYearTeams: number;
    };
    loading?: boolean;
}

export const TeamStats: React.FC<Props> = ({ stats, loading = false }) => {
    const statsCards = [
        { title: 'إجمالي الفِرَق', value: stats.totalTeams, icon: 'groups', color: 'from-blue-500 to-blue-600' },
        { title: 'فِرَق نشطة', value: stats.activeTeams, icon: 'verified', color: 'from-green-500 to-green-600' },
        { title: 'إجمالي الأعضاء', value: stats.totalMembers, icon: 'person', color: 'from-purple-500 to-purple-600' },
        { title: 'فِرَق هذا العام', value: stats.thisYearTeams, icon: 'calendar_month', color: 'from-orange-500 to-orange-600' },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-32 animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {statsCards.map((card, index) => (
                <div key={index} className={`card-hover bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm font-medium">{card.title}</p>
                            <h3 className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</h3>
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