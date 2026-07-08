// src/components/admin/ProjectStats.tsx
import React from 'react';

interface Props {
    stats: {
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        thisYearProjects: number;
    };
    loading?: boolean;
}

export const ProjectStats: React.FC<Props> = ({ stats, loading = false }) => {
    const statsCards = [
        { title: 'إجمالي المشاريع', value: stats.totalProjects, icon: 'stacked_bar_chart', color: 'from-blue-500 to-blue-600' },
        { title: 'مشاريع نشطة', value: stats.activeProjects, icon: 'trending_up', color: 'from-green-500 to-green-600' },
        { title: 'مشاريع مكتملة', value: stats.completedProjects, icon: 'check_circle', color: 'from-purple-500 to-purple-600' },
        { title: 'مشاريع هذا العام', value: stats.thisYearProjects, icon: 'calendar_month', color: 'from-orange-500 to-orange-600' },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-32 animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            {statsCards.map((card, index) => (
                <div key={index} className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-elevated `}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/80 text-sm font-medium">{card.title}</p>
                            <h3 className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};