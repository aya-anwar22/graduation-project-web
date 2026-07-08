// src/features/Student/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: string;
    iconBg: string;
    iconColor: string;
    delay: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, iconColor, delay }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md animate-slide-up" style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-center gap-3">
                <div className={`${iconBg} p-2 rounded-lg`}>
                    <span className={`material-symbols-outlined ${iconColor} text-lg`}>{icon}</span>
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{title}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};