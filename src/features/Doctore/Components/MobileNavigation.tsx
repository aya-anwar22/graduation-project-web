// Components/MobileNavigation.tsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string>(location.pathname);

    const navigationItems = [
        {
            id: '/',
            label: 'الرئيسية',
            icon: 'mdi:view-dashboard',
            activeIcon: 'mdi:view-dashboard',
            badge: null
        },
        {
            id: '/myProject',
            label: 'المشاريع',
            icon: 'mdi:folder-outline',
            activeIcon: 'mdi:folder',
            badge: 3
        },
        {
            id: '/notifications',
            label: 'الإشعارات',
            icon: 'mdi:bell-outline',
            activeIcon: 'mdi:bell',
            badge: 5
        },
        {
            id: '/profile',
            label: 'الملف',
            icon: 'mdi:account-outline',
            activeIcon: 'mdi:account',
            badge: null
        }
    ];

    const handleNavigation = (path: string) => {
        setActiveTab(path);
        navigate(path);
    };

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50 py-2">
            <div className="flex items-center justify-around">
                {navigationItems.map((item) => {
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`flex flex-col items-center justify-center relative p-2 ${isActive
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            {/* Badge for notifications */}
                            {item.badge && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {item.badge}
                                </span>
                            )}

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-lg"></div>
                            )}

                            {/* Icon */}
                            <div className={`p-2 rounded-xl ${isActive
                                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30'
                                    : 'bg-transparent'
                                }`}>
                                <Icon
                                    icon={isActive ? item.activeIcon : item.icon}
                                    className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}
                                />
                            </div>

                            {/* Label */}
                            <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                {/* Add Project Floating Button */}
                <button
                    onClick={() => {
                        navigate('/myProject/new');
                        const announcement = document.getElementById('nav-announcement');
                        if (announcement) {
                            announcement.textContent = 'انتقال إلى إنشاء مشروع جديد';
                        }
                    }}
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300"
                    aria-label="إنشاء مشروع جديد"
                    title="إضافة مشروع جديد"
                >
                    <Icon icon="mdi:plus" className="text-2xl" aria-hidden="true" />
                </button>
            </div>

            {/* Optional: Quick Actions Menu (Swipe up) */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-2"></div>
            </div>
        </div>
    );
};

export default MobileNavigation;