// src/components/sideBarAdmin/SideBarAdmin.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';


interface NavItemProps {
    href: string;
    icon: string;
    label: string;
    isActive?: boolean;
    isFilled?: boolean;
    imageSrc?: string;
}

const SidebarAdmin: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // دالة للتحقق من الرابط النشط
    const isActivePath = (path: string): boolean => {
        if (path === '' && location.pathname === '/admin') {
            return true;
        }
        return location.pathname === `/admin/${path}` ||
            (path === '' && location.pathname === '/admin');
    };
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    // مكون عنصر القائمة
    const NavItem: React.FC<NavItemProps> = ({
        href,
        icon,
        label,
        isActive = false,
        isFilled = false,
        imageSrc
    }) => {
        const linkClasses = `
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400'
            }
    `;

        const textClasses = `
        text-sm ${isActive ? 'font-semibold' : 'font-medium'} leading-normal
    `;

        const linkPath = href === '' ? '/admin' : `/admin/${href}`;

        return (
            <Link to={linkPath} className={linkClasses}>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={label}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                ) : (
                    <span className={`material-symbols-outlined ${isFilled ? 'fill' : ''} text-xl`}>
                        {icon}
                    </span>
                )}
                <p className={textClasses}>{label}</p>
            </Link>
        );
    };

    return (
        <>
            {/* Sidebar للشاشات الكبيرة - ثابت */}
            <aside className="fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-900 border-l dark:border-gray-800 shadow-lg flex flex-col z-50 hidden lg:flex">
                {/* معلومات المستخدم */}
                <div className="flex flex-col gap-4 p-4 border-b dark:border-gray-800">
                    <div className="flex gap-3 items-center">
                        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
                            A
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-gray-900 dark:text-gray-200 text-base font-bold leading-normal">
                                Admin
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                                مدير النظام
                            </p>
                        </div>
                    </div>
                </div>

                {/* القائمة الرئيسية - قابلة للتمرير داخلياً */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <NavItem
                        href=""
                        icon="dashboard"
                        label="لوحة التحكم"
                        isActive={isActivePath('')}
                    />

                    <NavItem
                        href="universities"
                        icon="account_balance"
                        label="الجامعات"
                        isActive={isActivePath('universities')}
                        isFilled={true}
                    />

                    <NavItem
                        href="departments"
                        icon="corporate_fare"
                        label="الأقسام"
                        isActive={isActivePath('departments')}
                    />

                    <NavItem
                        href="doctors"
                        icon="psychology"
                        label="الدكاترة"
                        isActive={isActivePath('doctors')}
                    />

                    <NavItem
                        href="projects"
                        icon="folder_managed"
                        label="المشاريع"
                        isActive={isActivePath('projects')}
                    />

                    <NavItem
                        href="teams"
                        icon="groups"
                        label="الفِرَق"
                        isActive={isActivePath('teams')}
                    />

                    <NavItem
                        href="users"
                        icon="group"
                        label="المستخدمين"
                        isActive={isActivePath('users')}
                    />

                    <NavItem
                        href="notifications"
                        icon="notifications"
                        label="الإشعارات"
                        isActive={isActivePath('notifications')}
                    />

                    <NavItem
                        href="profile"
                        icon="person"
                        label="الملف الشخصي"
                        isActive={isActivePath('profile')}
                        imageSrc="https://ui-avatars.com/api/?name=Admin&background=e61919&color=fff"
                    />
                </nav>

                {/* تسجيل الخروج */}
                <div className="p-4 border-t dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 mt-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all w-full group"
                        aria-label="تسجيل الخروج"
                        title="تسجيل الخروج"
                    >
                        <Icon
                            icon="mdi:logout"
                            className="text-xl group-hover:rotate-180 transition-transform"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium flex-1 text-right">تسجيل الخروج</p>
                    </button>
                </div>
            </aside>

            {/* مساحة فارغة بنفس عرض الـ sidebar للشاشات الكبيرة */}
            <div className="hidden lg:block w-64 flex-shrink-0"></div>

            {/* Sidebar للشاشات الصغيرة - شريط سفلي متحرك */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-lg z-50">
                <div className="flex justify-around p-2 overflow-x-auto">
                    <NavItem href="" icon="dashboard" label="الرئيسية" />
                    <NavItem href="universities" icon="account_balance" label="الجامعات" />
                    <NavItem href="departments" icon="corporate_fare" label="الأقسام" />
                    <NavItem href="doctors" icon="psychology" label="الدكاترة" />
                    <NavItem href="projects" icon="folder_managed" label="المشاريع" />
                    <NavItem href="teams" icon="groups" label="الفرق" />
                    <NavItem href="users" icon="group" label="المستخدمين" />
                    <NavItem href="profile" icon="person" label="الملف" />
                </div>
            </div>
        </>
    );
};

export default SidebarAdmin;