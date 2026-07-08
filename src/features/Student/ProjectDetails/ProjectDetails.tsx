// pages/ProjectDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    decodeArabicFileName,
    getFileExtension,
    getFileTypeInfo,
    getFileSizeInfo,
    formatFileDate
} from '../../../utlis/fileUtlils';
import Loading from '../../../components/loading/loading';
import ProjectDetailsService from '../services/PrijectDetailService';

interface ProjectStatusConfig {
    text: string;
    color: string;
    icon: string;
}

const statusConfig: Record<string, ProjectStatusConfig> = {
    completed: { text: "مكتمل", color: "bg-green-500", icon: "check_circle" },
    pending: { text: "قيد التنفيذ", color: "bg-yellow-500", icon: "pending" },
    in_progress: { text: "قيد العمل", color: "bg-blue-500", icon: "sync" },
    start: { text: "مبدئي", color: "bg-blue-400", icon: "play_arrow" },
};

function Field({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                {label}
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                    {icon}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
            </div>
        </div>
    );
}

const ProjectDetailsPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) {
                setError('معرف المشروع غير صالح');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await ProjectDetailsService.getProjectDetails(projectId);

                if (result.success) {
                    setProject(result.data);
                } else {
                    setError(result.message);
                }
            } catch (err: any) {
                setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <Loading />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl mb-4">
                            error
                        </span>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                            {error || 'لم يتم العثور على المشروع'}
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            العودة للخلف
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const status = statusConfig[project.projectStatus] || {
        text: "غير معروف",
        color: "bg-gray-500",
        icon: "help",
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_right</span>
                            <span>العودة</span>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            تفاصيل المشروع
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 lg:p-8 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`size-3 rounded-full ${status.color} animate-pulse`}></span>
                                <span className="font-medium">{status.text}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-2">
                                {project.projectTitle}
                            </h1>
                            <p className="text-white/80 text-lg">
                                {project.projectMainObjectives}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-white/90">فريق: {project.teamName}</p>
                                <p className="text-white/70 text-sm">رمز الفريق: {project.teamCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Project Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <div className='flex justify-between'>
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                                    معلومات المشروع
                                </h2>
                                <a
                                    href={project.projectLink as string}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    لنك المشروع
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field label="عنوان المشروع" icon="title" value={project.projectTitle} />
                                <Field label="سنة المشروع" icon="calendar_month" value={project.projectYear} />
                                <Field label="نوع المشروع" icon="web" value={project.projectType === 'web' ? 'ويب' : project.projectType} />
                                <Field label="حالة المشروع" icon={status.icon} value={status.text} />
                                <Field label="القسم" icon="school" value={project.departmentName} />
                                <Field label="الجامعة" icon="apartment" value={project.universityName} />
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                    وصف المشروع
                                </label>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                        {project.projectDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Objectives */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                    الأهداف الرئيسية
                                </label>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                        {project.projectMainObjectives}
                                    </p>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                    التقنيات المستخدمة
                                </label>
                                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    {project.technologies.map((tech: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Files Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">folder</span>
                                الملفات والمستندات ({project.files?.length || 0})
                            </h2>

                            {project.files && project.files.length > 0 ? (
                                <div className="space-y-3">
                                    {project.files.map((file: any, index: number) => {
                                        const fileName = decodeArabicFileName(file.fileName || 'ملف');
                                        const fileType = getFileExtension(fileName);
                                        const { icon, color, bgColor, typeName } = getFileTypeInfo(fileType);

                                        return (
                                            <div
                                                key={file.fileId || index}
                                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`${bgColor} p-3 rounded-lg flex-shrink-0`}>
                                                        <span className={`material-symbols-outlined ${color}`}>
                                                            {icon}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                                                            {fileName}
                                                        </p>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                                                {typeName}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-500">
                                                                {getFileSizeInfo(file.filePath)}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-500">
                                                                {formatFileDate(file.filePath)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <a
                                                        href={file.filePath}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                                        title="عرض الملف"
                                                    >
                                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                                                            open_in_new
                                                        </span>
                                                    </a>
                                                    <a
                                                        href={file.filePath}
                                                        download={fileName}
                                                        className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                                        title="تحميل الملف"
                                                    >
                                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                                                            download
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-4xl mb-2">
                                        folder_off
                                    </span>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        لا توجد ملفات متاحة
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Side Info */}
                    <div className="space-y-8">
                        {/* Supervisor Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">person</span>
                                المشرف الأكاديمي
                            </h2>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900/30 mb-4">
                                    <img
                                        src={project.doctorImage}
                                        alt={project.doctorFullName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + project.doctorFullName;
                                        }}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {project.doctorFullName}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">دكتور</p>
                                <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                        <span>{project.doctorEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">phone</span>
                                        <span>{project.doctorPhone}</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {project.doctorBio}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">groups</span>
                                فريق العمل ({project.teamMembers?.length || 0})
                            </h2>

                            <div className="space-y-4">
                                {project.teamMembers && project.teamMembers.length > 0 ? (
                                    project.teamMembers.map((member: any, index: number) => (
                                        <div
                                            key={member.memberId || index}
                                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                <img
                                                    src={member.memberProfileImage}
                                                    alt={member.memberFullName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.memberFullName;
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {member.memberFullName}
                                                    </h4>
                                                    {member.memberIsLeader && (
                                                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                                                            قائد
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                    {member.memberRole}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                                    {member.memberEmail}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        لا يوجد أعضاء في الفريق
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailsPage;