// src/features/Admin/DepartmentsAdmin/DepartmentStats.tsx
import React from 'react';
import { Building, TrendingUp, Users, Crown } from 'lucide-react';
import type { DepartmentStatsType as StatsType } from '../AdminTypes/Department.interface';

interface DepartmentStatsProps {
    stats: StatsType;
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({ stats }) => {
    const statsConfig = [
        { icon: Building, title: 'إجمالي الأقسام', value: stats.totalDepartments, color: 'from-blue-500 to-blue-600' },
        { icon: TrendingUp, title: 'أقسام نشطة', value: stats.activeDepartments, color: 'from-green-500 to-green-600' },
        { icon: Users, title: 'إجمالي الدكاترة', value: stats.totalDoctors, color: 'from-purple-500 to-purple-600' },
        { icon: Crown, title: 'رؤساء الأقسام', value: stats.headDepartments, color: 'from-orange-500 to-orange-600' },
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