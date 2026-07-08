import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/language.context";
import { useTranslation } from "react-i18next";
import { getProfile } from "../../features/Student/services/userService";
import type { ApiStudentProfileResponse } from "../../features/Student/types/profile.interface";
import { toastError } from "../../utlis/tost";

interface MenuItem {
    name: string;
    icon: string;
    link: string;
    active?: boolean;
    special?: boolean;
}

export default function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { lang, changeLanguage } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const { t, i18n } = useTranslation();
    const [studentData, setStudentData] = useState<ApiStudentProfileResponse | null>(null);

    // مزامنة i18n مع context اللغة
    useEffect(() => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken")
        navigate('/login');
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLanguageChange = () => {
        const newLang = lang === "ar" ? "en" : "ar";

        // تغيير اللغة في context
        changeLanguage(newLang);

        // تغيير اللغة في i18n
        i18n.changeLanguage(newLang);

        // تغيير اتجاه الصفحة
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
    };

    const menuItems: MenuItem[] = [
        { name: t("home"), icon: "dashboard", link: "/" },
        { name: t("myProject"), icon: "business_center", link: "/myproject" },
        { name: t("team"), icon: "group", link: "/myTeam" },
        // { name: t("aiAssistant"), icon: "auto_awesome", link: "/ai" },
        // { name: t("chat"), icon: "forum", link: "/chat" },
        { name: t("requestSupervision"), icon: "person_add", link: "/request", special: true },
        // { name: t("notifications"), icon: "notifications", link: "/notifications" },
        // { name: t("previousProjects"), icon: "history", link: "/previous" },
    ];

    // تحميل بيانات البروفايل مرة واحدة عند تركيب الكومبوننت
    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                const data = await getProfile();
                if (!ignore) {
                    setStudentData(data);
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Error loading profile:", error);
                    toastError("فشل في تحميل البيانات");
                }
            }
        };

        loadProfile();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            {/* Mobile Header */}
            <div className={`lg:hidden flex items-center justify-between p-4  bg-white dark:bg-[#1a2233] fixed top-0 left-0 right-0 z-30 transition-all duration-300
                ${isScrolled
                    ? 'shadow-md border-b border-gray-200 dark:border-gray-700'
                    : 'border-b border-transparent'
                }
            `}>                <div className="flex items-center gap-3">

                    <h1 className="text-xl font-bold dark:text-white">{t("appName")}</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleLanguageChange}
                        className="text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[50px]"
                    >
                        {lang === "ar" ? "English" : "العربية"}
                    </Button>

                    <button
                        onClick={() => setOpen(true)}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#101522] flex items-center justify-center"
                        aria-label={t("openMenu")}
                    >
                        <span className="material-symbols-outlined dark:text-white">
                            menu
                        </span>
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white dark:bg-[#1a2233] z-50 transform transition-transform duration-300 lg:hidden shadow-xl ${open ? "translate-x-0" : "translate-x-full"}`}
                dir={lang === "ar" ? "rtl" : "ltr"}
            >
                <div className="p-4 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold dark:text-white">{t("appName")}</h1>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#101522] flex items-center justify-center"
                            aria-label={t("closeMenu")}
                        >
                            <span className="material-symbols-outlined dark:text-white">
                                close
                            </span>
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex flex-col gap-2 flex-grow">
                        {menuItems.map((item, i) => (
                            <NavLink
                                key={i}
                                to={item.link}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    ${item.special
                                        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg"
                                        : isActive
                                            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-white border-r-4 border-primary"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pr-2"
                                    }
                                `}
                                onClick={() => setOpen(false)}
                            >

                                <span className="flex-1">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="border-t dark:border-gray-700 pt-6 mt-4">
                        <Button onClick={() => navigate('/profile')}>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                                    src={studentData?.data.profileImage}
                                    alt={t("userImage")}
                                />
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold dark:text-white">
                                        {t(`${studentData?.data.fullName}`)}
                                    </h4>
                                    <p className="text-xs text-gray-500 lowercase dark:text-gray-400">
                                        {t(`${studentData?.data.email}`)}
                                    </p>
                                </div>
                            </div>
                        </Button>

                        {/* Language Switcher in Mobile Sidebar */}
                        <div className="mb-3">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleLanguageChange}
                                className="w-full text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                {lang === "ar" ? "Switch to English" : "التغيير إلى العربية"}
                            </Button>
                        </div>

                        <Button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg transition"
                        // startIcon={<span className="material-symbols-outlined">logout</span>}
                        >
                            {t("logout")}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex fixed right-0 top-0 h-full w-72 bg-white dark:bg-[#1a2233] border-l dark:border-gray-800 p-6 flex-col shadow-lg"
                dir={lang === "ar" ? "rtl" : "ltr"}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">

                    <h1 className="text-xl font-bold dark:text-white">{t("appName")}</h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-grow">
                    {menuItems.map((item, i) => (
                        <NavLink
                            key={i}
                            to={item.link}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${item.special
                                    ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                                    : isActive
                                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-white border-r-4 border-primary shadow-sm"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:pr-2"
                                }
                            `}
                            end
                        >
                            {/* <span className="material-symbols-outlined text-lg">
                                {item.icon}
                            </span> */}
                            <span className="flex-1">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="border-t dark:border-gray-700 pt-6 mt-4">
                    <Button onClick={() => navigate('/profile')} className="pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                                src={studentData?.data.profileImage}
                                alt={t("userImage")}
                            />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold dark:text-white">
                                    {t(`${studentData?.data.fullName}`)}
                                </h4>
                                <p className="text-xs text-gray-500 lowercase dark:text-gray-400">
                                    {t(`${studentData?.data.email}`)}
                                </p>
                            </div>
                        </div>
                    </Button>
                    {/* Language Switcher in Desktop Sidebar */}
                    <div className="mb-3">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleLanguageChange}
                            className="w-full text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {lang === "ar" ? "Switch to English" : "التغيير إلى العربية"}
                        </Button>
                    </div>

                    <Button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-lg transition"
                    // startIcon={<span className="material-symbols-outlined">logout</span>}
                    >
                        {t("logout")}
                    </Button>
                </div>
            </aside>

            {/* Main Content Padding for Desktop */}
            <div className="hidden lg:block ml-72"></div>
        </>
    );
}