// components/ProjectDetails.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectDetails, updateProjectStatus } from '../DoctorServices/projectDetailsService';
import { StatusLabels, StatusColors, type ProjectDetails } from '../TypesDoctor/projectDetails.interface';
import { decodeArabicFileName, formatFileDate, getFileExtension, getFileSizeInfo, getFileTypeInfo } from '../../../utlis/fileUtlils';
import { toastError, toastSuccess } from '../../../utlis/tost';

const ProjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);

    // صور افتراضية
    const defaultImages = {
        web: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200',
        mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
        ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
        default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'
    };

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails();
        }
    }, [projectId]);

    const fetchProjectDetails = async () => {
        if (!projectId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getProjectDetails(projectId);
            if (response.success && response.data.length > 0) {
                setProject(response.data[0]);
                // التحقق من حالة التميز بعد جلب البيانات
                const projectData = response.data[0];
                setIsFeatured(projectData.projectStatus === 'start' || projectData.isFeatured || false);
            } else {
                setError('لم يتم العثور على المشروع');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                setError(error.message);
                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                setError('حدث خطأ في تحميل البيانات');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/doctor/projectDoctor');
    };

    const handleSendMessage = (email: string, name: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const getProjectImage = (): string => {
        if (project?.projectImage) return project.projectImage;

        if (project?.projectType.includes('web')) return defaultImages.web;
        if (project?.projectType.includes('mobile')) return defaultImages.mobile;
        if (project?.projectType.includes('ai')) return defaultImages.ai;
        return defaultImages.default;
    };

    const getStatusColor = (status: string) => {
        return StatusColors[status] ||
            { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' };
    };

    const getStatusLabel = (status: string) => {
        return StatusLabels[status] || status;
    };

    // ✅ دالة تغيير حالة المشروع (مميز / عادي)
    const handleToggleFeatured = async () => {
        if (!projectId) return;

        const newStatus = isFeatured ? 'completed' : 'start';

        try {
            setUpdating(true);
            const result = await updateProjectStatus(projectId, newStatus);

            if (result.success) {
                setIsFeatured(!isFeatured);
                // تحديث حالة المشروع في الـ project
                setProject(prev => prev ? { ...prev, projectStatus: newStatus } : null);
                toastSuccess(`✅ تم ${isFeatured ? 'إزالة التميز عن' : 'تمييز'} المشروع بنجاح`);
            } else {
                throw new Error(result.message || 'فشل في تغيير الحالة');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toastError('❌ حدث خطأ في تغيير حالة المشروع');
        } finally {
            setUpdating(false);
        }
    };

    // عرض حالة التحميل
    if (loading) {
        return (
            <main className="p-4 md:p-6">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">جاري تحميل بيانات المشروع...</p>
                </div>
            </main>
        );
    }

    // عرض رسالة الخطأ
    if (error || !project) {
        return (
            <main className="p-4 md:p-6">
                <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">حدث خطأ</h3>
                        <p className="text-red-600 dark:text-red-300 mb-6">{error || 'المشروع غير موجود'}</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            العودة للمشاريع
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const statusColors = getStatusColor(project.projectStatus);

    return (
        <main className="p-4 md:p-6">
            {/* Header with Back Button */}
            <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="cursor-pointer flex items-center gap-2 text-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-4"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    العودة للمشاريع
                </button>

                {/* ✅ Header مع زر التميز */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-800 mb-2">
                            {project.projectTitle}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                <span className="text-sm">{project.projectYear}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">school</span>
                                <span className="text-sm">{project.universityName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">business_center</span>
                                <span className="text-sm">{project.departmentName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`bg-gray-700 ${statusColors.text} px-4 py-2 rounded-full text-sm font-medium`}>
                            {getStatusLabel(project.projectStatus)}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
                            {project.projectType}
                        </span>

                        {/* ✅ زر تغيير حالة التميز */}
                        <button
                            onClick={handleToggleFeatured}
                            disabled={updating}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isFeatured
                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md shadow-yellow-500/30'
                                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {updating ? (
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">
                                    {isFeatured ? 'star' : 'star_border'}
                                </span>
                            )}
                            {isFeatured ? 'مميز ⭐' : 'جعله مميز'}
                        </button>
                    </div>
                </div>

                {/* Project Image Banner */}
                <div className="mb-6">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <div
                            className="w-full h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
                            style={{
                                backgroundImage: `url(${getProjectImage()})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{project.projectTitle}</h2>
                                    <p className="text-white/90 text-sm">
                                        {project.teamName} • {project.teamCode}
                                    </p>
                                </div>
                                {/* ✅ عرض حالة التميز في البانر */}
                                {isFeatured && (
                                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        مميز
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">group</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm">أعضاء الفريق</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {project.teamMembers.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">code</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm">التقنيات المستخدمة</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {project.technologies.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">description</span>
                                وصف المشروع
                            </h2>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {project.projectId}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                            {project.projectDescription}
                        </p>
                    </div>

                    {/* Main Objectives */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">target</span>
                            الأهداف الرئيسية
                        </h2>
                        <div className="space-y-4">
                            {project.projectMainObjectives.split('\n').map((objective, index) => (
                                objective.trim() && (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{objective}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">group</span>
                                أعضاء الفريق
                            </h2>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-normal px-3 py-1 rounded-full">
                                {project.teamCode}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.teamMembers.map((member) => (
                                <div key={member.memberId} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={member.memberProfileImage}
                                            alt={member.memberFullName}
                                            className="w-12 h-12 rounded-full ring-2 ring-gray-300 dark:ring-gray-600 object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className="text-gray-800 dark:text-white font-medium">{member.memberFullName}</h4>
                                                {member.memberIsLeader && (
                                                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded-full">
                                                        قائد
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.memberRole}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSendMessage(member.memberEmail, member.memberFullName)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">mail</span>
                                                    <span>مراسلة</span>
                                                </button>
                                                <button
                                                    onClick={() => handleCall(member.memberPhone)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">call</span>
                                                    <span>اتصال</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Supervisor Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                <img
                                    src={project.doctorImage}
                                    alt={project.doctorFullName}
                                    className="w-24 h-24 rounded-full mb-4 ring-4 ring-orange-100 dark:ring-orange-900/50 object-cover"
                                />
                                <div className="absolute bottom-4 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                    المشرف
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                {project.doctorFullName}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                {project.doctorBio}
                            </p>

                            <div className="space-y-3">
                                <a
                                    href={`mailto:${project.doctorEmail}`}
                                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-blue-500">mail</span>
                                    <span className="text-gray-800 dark:text-white text-sm">{project.doctorEmail}</span>
                                </a>

                                <a
                                    href={`tel:${project.doctorPhone}`}
                                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-blue-500">phone</span>
                                    <span className="text-gray-800 dark:text-white text-sm">{project.doctorPhone}</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">معلومات إضافية</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">الجامعة</span>
                                    <span className="text-gray-800 dark:text-white text-sm font-medium">
                                        {project.universityName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">القسم</span>
                                    <span className="text-gray-800 dark:text-white text-sm font-medium">
                                        {project.departmentName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technologies */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">code</span>
                            التقنيات المستخدمة
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm">code</span>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Files */}
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
            </div>
        </main>
    );
};

export default ProjectDetails;