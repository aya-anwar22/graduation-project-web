// Components/StatCard.tsx
import React from 'react';
import { Icon } from '@iconify/react';

interface StatCardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
    bgColor: string;
    darkBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    icon, 
    color, 
    bgColor, 
    darkBgColor 
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className={`p-2 md:p-3 ${bgColor} ${darkBgColor} rounded-xl`}>
                <Icon icon={icon} className={`text-xl md:text-2xl ${color}`} />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                {value.toLocaleString('ar-EG')}
            </span>
        </div>
        <h3 className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
            {title}
        </h3>
        {/* Optional: Progress bar or trend indicator */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>مقارنة بالشهر الماضي</span>
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Icon icon="mdi:trending-up" className="text-sm" />
                    12%
                </span>
            </div>
        </div>
    </div>
);

export default StatCard;