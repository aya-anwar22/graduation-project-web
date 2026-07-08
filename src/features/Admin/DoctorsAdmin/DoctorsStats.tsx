// src/features/Admin/DoctorsAdmin/DoctorsStats.tsx
import React from 'react';

interface StatsType {
    total: number;
    active: number;
    heads: number;
    inactive: number;
}

interface DoctorsStatsProps {
    stats: StatsType;
}

const StatCard: React.FC<{
    title: string;
    value: number;
    gradient: string;
    icon: string;
}> = ({ title, value, gradient, icon }) => (
    <div className={`card-hover bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg `}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-white/80 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2">{value}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
    </div>
);

export const DoctorsStats: React.FC<DoctorsStatsProps> = ({ stats }) => {
    const cards = [
        { title: 'إجمالي الدكاترة', value: stats.total, gradient: 'from-blue-500 to-blue-600', icon: 'psychology' },
        { title: 'نشطين', value: stats.active, gradient: 'from-green-500 to-green-600', icon: 'verified_user' },
        { title: 'رؤساء الأقسام', value: stats.heads, gradient: 'from-purple-500 to-purple-600', icon: 'supervisor_account' },
        { title: 'غير نشطين', value: stats.inactive, gradient: 'from-red-500 to-red-600', icon: 'person_off' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
};