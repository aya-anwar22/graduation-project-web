import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { ProjectData } from '../types/myProject.interface';
import { getMyProject } from '../services/myProjectService';
import Loading from '../../../components/loading/loading';
import TeamSection from '../MyTeam/MyTeam';
import { decodeArabicFileName, extractFileName, formatFileDate, getFileExtension, getFileSizeInfo, getFileTypeInfo } from '../../../utlis/fileUtlils';
import FileUploadService from '../services/uploadeFiles';
import EditProjectModal from '../UpdateProject/UpdateProject';

type ProjectStatus = "completed" | "pending" | "in_progress";

const statusMap: Record<ProjectStatus, {
    text: string;
    color: string;
    icon: string;
}> = {
    completed: { text: "مكتمل", color: "bg-green-500", icon: "check_circle" },
    pending: { text: "قيد التنفيذ", color: "bg-yellow-500", icon: "pending" },
    in_progress: { text: "قيد العمل", color: "bg-blue-500", icon: "sync" },
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

const MyProject: React.FC = () => {
    const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
    const [fileDescription, setFileDescription] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [fileToDelete, setFileToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    const handleFileUpload = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadError('يرجى اختيار ملف لرفعه');
            return;
        }

        if (!project?.projectId) {
            setUploadError('لا يوجد مشروع محدد');
            return;
        }

        const validation = FileUploadService.validateFile(selectedFile);
        if (!validation.isValid) {
            setUploadError(validation.message || 'الملف غير صالح');
            return;
        }

        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);

        try {
            const result = await FileUploadService.uploadProjectFile(
                selectedFile,
                fileDescription,
                project.projectId
            );

            if (result.success) {
                setUploadSuccess('تم رفع الملف بنجاح!');
                await reloadProjectData();
                resetUploadForm();
                setTimeout(() => setUploadSuccess(null), 3000);
            } else {
                setUploadError(result.message || 'فشل في رفع الملف');
            }
        } catch (error: any) {
            setUploadError(error.message || 'حدث خطأ غير متوقع');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const validation = FileUploadService.validateFile(file);

            if (!validation.isValid) {
                setUploadError(validation.message || 'الملف غير صالح');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setUploadError(null);
        }
    };

    const reloadProjectData = async () => {
        try {
            const res = await getMyProject();
            if (res.data) {
                setProject(res.data);
            }
        } catch (error) {
            console.error('Error reloading project data:', error);
        }
    };

    const resetUploadForm = () => {
        setSelectedFile(null);
        setFileDescription('');
        setShowUploadForm(false);
    };

    // Modal تعديل المشروع
    const openEditModal = () => setShowEditModal(true);
    const closeEditModal = () => setShowEditModal(false);
    const handleUpdateSuccess = () => reloadProjectData();

    // Modal حذف الملفات
    const openDeleteModal = (fileId: string, fileName: string) => {
        setFileToDelete({ id: fileId, name: fileName });
        setDeleteError(null);
        setDeleteSuccess(null);
    };

    const closeDeleteModal = () => {
        setFileToDelete(null);
        setDeleting(false);
        setDeleteError(null);
        setDeleteSuccess(null);
    };

    const handleDeleteFile = async () => {
        if (!fileToDelete || !project?.projectId) {
            closeDeleteModal();
            return;
        }

        setDeleting(true);
        setDeleteError(null);
        setDeleteSuccess(null);

        try {
            const result = await FileUploadService.deleteProjectFile(
                fileToDelete.id,
                project.projectId
            );

            if (result.success) {
                setDeleteSuccess('تم حذف الملف بنجاح!');
                await reloadProjectData();

                setTimeout(() => {
                    closeDeleteModal();
                    setTimeout(() => setDeleteSuccess(null), 3000);
                }, 1500);
            } else {
                setDeleteError(result.message || 'فشل في حذف الملف');
            }
        } catch (error: any) {
            setDeleteError('حدث خطأ غير متوقع أثناء حذف الملف');
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        getMyProject()
            .then((res) => setProject(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;

    if (!project) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <span className="material-symbols-outlined text-gray-400 text-4xl mb-4">
                    error
                </span>
                <p className="text-gray-600 dark:text-gray-400">لا توجد بيانات للمشروع</p>
            </div>
        </div>
    );

    const status = statusMap[project.projectStatus as ProjectStatus] ?? {
        text: "غير معروف",
        color: "bg-gray-500",
        icon: "help",
    };

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8 mb-6 md:mb-8 shadow-lg">
                    <div className="absolute inset-0 bg-white opacity-5"></div>

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                                مشروعي: {project.projectTitle}
                            </h1>
                            <p className="text-white/90 text-base lg:text-lg">
                                {project.projectMainObjectives}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                            {status && (
                                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <div className={`size-3 rounded-full ${status.color} animate-pulse`}></div>
                                    <p className="text-white font-medium">{status.text}</p>
                                </div>
                            )}

                            <button
                                onClick={openEditModal}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-200"
                            >
                                <span className="material-symbols-outlined">edit</span>
                                <span className="hidden sm:inline">تعديل المشروع</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Details Card */}
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
                    <div className='w-full pb-6'>
                        <img className='w-full rounded-2xl' src={project.projectImage as string} alt={project.projectTitle} />
                    </div>
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                            تفاصيل المشروع
                        </h2>
                        <a
                            href={project.projectLink as string}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            لنك المشروع
                        </a>                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-4">
                            <Field label="عنوان المشروع" icon="title" value={project.projectTitle} />
                            <Field label="حالة المشروع" icon={status.icon} value={status.text} />
                            <Field label="نوع المشروع" icon="web" value={project.projectType === 'web' ? 'ويب' : project.projectType} />
                        </div>

                        <div className="space-y-4">
                            <Field label="سنة المشروع" icon="calendar_month" value={project.projectYear} />
                            <Field label="رمز الفريق" icon="tag" value={project.teamCode} />
                            <Field label="القسم" icon="school" value={project.departmentName} />
                        </div>
                    </div>

                    {/* Technologies */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                            التقنيات المستخدمة
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                            وصف المشروع
                        </label>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                {project.projectDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column - Files & Documents */}
                    <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
                        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">folder</span>
                                    الملفات والمستندات ({project?.files?.length || 0})
                                </h2>
                                <button
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">upload</span>
                                    رفع ملف
                                </button>
                            </div>

                            {/* Upload Form */}
                            {showUploadForm && (
                                <div className="mb-6 p-4 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                    <form onSubmit={handleFileUpload} className="space-y-4">
                                        <div>
                                            <label htmlFor='uploadFile' className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                اختر الملف (الحد الأقصى 10MB)
                                            </label>
                                            <input
                                                id='uploadFile'
                                                type="file"
                                                onChange={handleFileChange}
                                                disabled={uploading}
                                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            {selectedFile && (
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                                                    الملف المحدد: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                وصف الملف (اختياري)
                                            </label>
                                            <input
                                                type="text"
                                                value={fileDescription}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFileDescription(e.target.value)}
                                                disabled={uploading}
                                                placeholder="أدخل وصفًا للملف..."
                                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="submit"
                                                disabled={uploading || !selectedFile}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploading ? (
                                                    <>
                                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                                        جاري الرفع...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                                        رفع الملف
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowUploadForm(false)}
                                                disabled={uploading}
                                                className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Files List */}
                            <div>
                                {project?.files && project.files.length > 0 ? (
                                    <div className="space-y-3">
                                        {project.files.map((file, index) => {
                                            const fileName = decodeArabicFileName(file.fileName || extractFileName(file.filePath));
                                            const fileType = getFileExtension(fileName);
                                            const { icon, color, bgColor, typeName } = getFileTypeInfo(fileType);

                                            return (
                                                <div
                                                    key={file.fileId || index}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0 mb-3 sm:mb-0">
                                                        <div className={`${bgColor} p-3 rounded-lg flex-shrink-0`}>
                                                            <span className={`material-symbols-outlined ${color}`}>
                                                                {icon}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                                                                {fileName}
                                                            </p>
                                                            <div className="flex items-center gap-2 flex-wrap">
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
                                                    <div className="flex items-center gap-2 self-end sm:self-center">
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
                                                        <button
                                                            onClick={() => openDeleteModal(file.fileId, fileName)}
                                                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                            title="حذف الملف"
                                                        >
                                                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                                                                delete
                                                            </span>
                                                        </button>
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
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                            لا توجد ملفات متاحة
                                        </p>
                                        <button
                                            onClick={() => setShowUploadForm(true)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                                        >
                                            اضغط هنا لرفع أول ملف
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Team Section */}
                    <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
                        <TeamSection />
                    </div>
                </div>
            </div>

            {/* Delete File Modal */}
            {fileToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={closeDeleteModal}
                    ></div>

                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl z-10">
                        <button
                            onClick={closeDeleteModal}
                            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                                close
                            </span>
                        </button>

                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">
                                    warning
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                تأكيد الحذف
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                هل أنت متأكد من حذف الملف؟
                            </p>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {fileToDelete.name}
                                </p>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                                ⚠️ لا يمكن التراجع عن هذه العملية
                            </p>
                        </div>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    <p className="text-sm">{deleteError}</p>
                                </div>
                            </div>
                        )}

                        {deleteSuccess && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <p className="text-sm">{deleteSuccess}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteFile}
                                disabled={deleting}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <span className="material-symbols-outlined animate-spin">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined">delete_forever</span>
                                )}
                                {deleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {(uploadSuccess || deleteSuccess) && !fileToDelete && (
                <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-4 sm:max-w-sm">
                    <div className="bg-green-600 text-white p-4 rounded-xl shadow-lg animate-slide-up">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined">check_circle</span>
                            <div className="flex-1">
                                <p className="font-medium">{uploadSuccess || deleteSuccess}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setUploadSuccess(null);
                                    setDeleteSuccess(null);
                                }}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {uploadError && !fileToDelete && (
                <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-4 sm:max-w-sm">
                    <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg animate-slide-up">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            <div className="flex-1">
                                <p className="font-medium">{uploadError}</p>
                            </div>
                            <button
                                onClick={() => setUploadError(null)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {project && (
                <EditProjectModal
                    project={project}
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    onSuccess={handleUpdateSuccess}
                />
            )}
        </main>
    );
};

export default MyProject;