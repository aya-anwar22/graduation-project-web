// src/features/Admin/UnvirstyAdmin/UniversityStats.tsx
import React from 'react';
import { Building, TrendingUp, Users, FolderKanban } from 'lucide-react';
import type { StatsData } from '../AdminTypes/Universty.interface';

interface UniversityStatsProps {
    stats: StatsData;
}

export const UniversityStats: React.FC<UniversityStatsProps> = ({ stats }) => {
    const statsConfig = [
        { icon: Building, title: 'إجمالي الجامعات', value: stats.totalUniversities, color: 'bg-blue-500' },
        { icon: TrendingUp, title: 'إجمالي الأقسام', value: stats.totalDepartments, color: 'bg-green-500' },
        { icon: Users, title: 'إجمالي الدكاترة', value: stats.totalDoctors, color: 'bg-purple-500' },
        { icon: FolderKanban, title: 'إجمالي المشاريع', value: stats.totalProjects, color: 'bg-orange-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {statsConfig.map((stat, index) => (
                <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 md:p-6 text-white shadow-lg`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</h3>
                        </div>
                        <div className="bg-white/20 p-2 md:p-3 rounded-lg">
                            <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};