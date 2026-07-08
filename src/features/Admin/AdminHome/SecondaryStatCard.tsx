// src/components/admin/dashboard/SecondaryStatCard.tsx
import React from 'react';

interface Props {
    title: string;
    value: number | string;
    icon: string;
    iconColor: string;
    bgColor: string;
    suffix?: string;
    animate?: boolean;
}

export const SecondaryStatCard: React.FC<Props> = ({ 
    title, 
    value, 
    icon, 
    iconColor, 
    bgColor, 
    suffix = '',
    animate = false 
}) => {
    return (
        <div className="stat-card bg-white dark:bg-gray-900 rounded-xl p-4 lg:p-6 shadow-subtle border border-gray-200 dark:border-gray-800 animate-slide-in hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </h3>
                </div>
                <div className={`${bgColor} p-2 lg:p-3 rounded-lg`}>
                    <span className={`material-symbols-outlined text-2xl lg:text-3xl ${iconColor} ${animate ? 'animate-pulse' : ''}`}>
                        {icon}
                    </span>
                </div>
            </div>
        </div>
    );
};