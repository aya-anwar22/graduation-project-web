import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: number;
    color: string;
    iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    title,
    value,
    color,
    iconBgColor = 'bg-opacity-10'
}) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 md:gap-4">
                <div className={`${color} ${iconBgColor} p-2 md:p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {value.toLocaleString()}
                    </h3>
                </div>
            </div>
        </div>
    );
};