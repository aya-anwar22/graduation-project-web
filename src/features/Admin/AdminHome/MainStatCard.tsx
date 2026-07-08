// src/components/admin/dashboard/MainStatCard.tsx
import React from 'react';

interface Props {
    title: string;
    value: number | string;
    icon: string;
    color: string;
    suffix?: string;
}

export const MainStatCard: React.FC<Props> = ({ title, value, icon, color, suffix = '' }) => {
    return (
        <div className={`stat-card bg-gradient-to-br ${color} rounded-xl p-4 lg:p-6 text-white shadow-lg animate-slide-in hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mt-2">
                        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </h3>
                </div>
                <div className="bg-white/20 p-2 lg:p-3 rounded-lg backdrop-blur-sm">
                    <span className="material-symbols-outlined text-2xl lg:text-3xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};