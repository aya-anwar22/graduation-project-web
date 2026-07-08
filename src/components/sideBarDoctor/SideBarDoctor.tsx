import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { DoctorProfileData } from '../../features/Doctore/TypesDoctor/doctorProfile.interfase';
import { toastError } from '../../utlis/tost';
import { doctorProfileService } from '../../features/Doctore/DoctorServices/doctorProfileService';

// Types
interface NavItem {
    id: number;
    name: string;
    icon: string;
    path: string;
    badge?: number;
}

// Navigation item component
const NavItem: React.FC<{ item: NavItem; location: any }> = ({ item, location }) => {
    const isActive = location.pathname === item.path ||
        (item.path === '/' && location.pathname === '/');

    return (
        <NavLink
            to={item.path}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                    ? 'bg-gradient-to-l from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                }
            `}
            aria-label={item.name}
        >
            <Icon
                icon={item.icon}
                className={`text-xl ${isActive ? 'opacity-100' : 'opacity-90'}`}
                aria-hidden="true"
            />
            <span className="text-sm font-medium flex-1 text-right">{item.name}</span>

            {item.badge && item.badge > 0 && (
                <span
                    className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center"
                    aria-label={`${item.badge} إشعارات جديدة`}
                >
                    {item.badge}
                </span>
            )}
        </NavLink>
    );
};

// Mobile Header Component
interface MobileHeaderProps {
    user?: DoctorProfileData;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
    user,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
}) => (
    <div className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                    title={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                >
                    <Icon
                        icon={isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'}
                        className="text-2xl"
                        aria-hidden="true"
                    />
                </button>

                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                        <Icon icon="mdi:school" className="text-white text-xl" aria-hidden="true" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-gray-800 dark:text-white">نظام المشاريع</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">لوحة التحكم</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="الإشعارات"
                    title="الإشعارات"
                >
                    <Icon icon="mdi:bell" className="text-xl" aria-hidden="true" />
                    <span
                        className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                        aria-label="3 إشعارات جديدة"
                    >
                        3
                    </span>
                </button>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-orange-200 dark:ring-orange-800"
                    style={{ backgroundImage: `url(${user?.profileImage})` }}
                    aria-label="فتح قائمة الملف الشخصي"
                    title="فتح قائمة الملف الشخصي"
                >
                    <span className="sr-only">صورة الملف الشخصي</span>
                </button>
            </div>
        </div>
    </div>
);

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [user, setUser] = useState<DoctorProfileData>();

    const navItems: NavItem[] = [
        { id: 1, name: 'لوحة التحكم', icon: 'mdi:view-dashboard', path: '/' },
        { id: 2, name: 'المشاريع', icon: 'mdi:folder-managed', path: 'projectDoctor' },
        { id: 3, name: 'طلبات الإشراف', icon: 'mdi:assignment', path: 'requests' },
        { id: 4, name: 'الفرق', icon: 'mdi:account-group', path: 'teams' },
        { id: 6, name: 'الطلاب', icon: 'mdi:school', path: 'students' },
    ];

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const loadProfile = async () => {
        try {
            const response = await doctorProfileService.getDoctorProfile();
            setUser(response.data);
        } catch (error) {
            console.error("Error loading profile:", error);
            toastError("فشل في تحميل البيانات");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <>
            <MobileHeader
                user={user}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {isMobileMenuOpen && (
                <button
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="إغلاق القائمة"
                    title="إغلاق القائمة"
                >
                    <span className="sr-only">إغلاق القائمة</span>
                </button>
            )}

            <aside className={`
                lg:flex lg:flex-col lg:bg-white lg:dark:bg-gray-800 lg:border-l lg:border-gray-100 lg:dark:border-gray-700 
                lg:w-64 lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:z-40 lg:shadow-xl
                fixed top-0 bottom-0 z-40 bg-white dark:bg-gray-800 shadow-2xl
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                w-64 right-0
            `} role="navigation" aria-label="القائمة الرئيسية">
                <div className="hidden lg:block p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                            <Icon icon="mdi:school" className="text-white text-2xl" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">نظام المشاريع</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">لوحة التحكم</p>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                            <Icon icon="mdi:school" className="text-white text-2xl" aria-hidden="true" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">نظام المشاريع</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">لوحة التحكم</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="إغلاق القائمة"
                        title="إغلاق القائمة"
                    >
                        <Icon icon="mdi:close" className="text-2xl" aria-hidden="true" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1 flex-grow p-4 pt-6 overflow-y-auto" aria-label="روابط التنقل">
                    {navItems.map((item) => (
                        <NavItem key={item.id} item={item} location={location} />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <NavLink
                        to="profileDoctor"
                        className="flex gap-3 items-center p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all group border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                        aria-label="الملف الشخصي"
                    >
                        <div className="relative">
                            <div
                                className="w-11 h-11 rounded-full bg-cover bg-center ring-2 ring-orange-200 dark:ring-orange-800 group-hover:ring-orange-300 dark:group-hover:ring-orange-700 transition-all"
                                style={{ backgroundImage: `url(${user?.profileImage})` }}
                                role="img"
                                aria-label={`صورة ${user?.fullName}`}
                            >
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" aria-label="متصل"></div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <h1 className="text-gray-800 dark:text-gray-100 text-sm font-semibold truncate">
                                {user?.fullName}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                                {user?.bio}
                            </p>
                        </div>
                        <Icon
                            icon="mdi:chevron-left"
                            className="text-gray-400 group-hover:text-orange-500 text-lg transition-colors"
                            aria-hidden="true"
                        />
                    </NavLink>
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
            <div className="lg:mr-64 pt-16 lg:pt-0"></div>
        </>
    );
};

export default Sidebar;