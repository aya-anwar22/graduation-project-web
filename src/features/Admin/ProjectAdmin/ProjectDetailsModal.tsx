// src/components/admin/ProjectDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { X, FileText, Link as LinkIcon, Users, Calendar, Tag, FolderOpen } from 'lucide-react';
import type { Project } from '../AdminTypes/Project.interface';
import ProjectService from '../AdminService/Project.service';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

interface Props {
    projectId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectDetailsModal: React.FC<Props> = ({ projectId, isOpen, onClose }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && projectId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await ProjectService.getProjectDetails(projectId);
                    setProject(data);
                } catch (error) {
                    console.error('Error fetching project details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, projectId]);

    if (!isOpen) return null;

    const getStatusText = (status: string) => {
        switch (status) {
            case 'start': return 'بداية';
            case 'in_progress': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'paused': return 'متوقف';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'start': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'in_progress': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'paused': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FolderOpen className="w-6 h-6 text-red-600" />
                        تفاصيل المشروع
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-gray-200" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <LoadingSpinner  />
                    </div>
                ) : project ? (
                    <div className="p-6 space-y-6">
                        {/* العنوان والحالة */}
                        <div>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                                    {getStatusText(project.status)}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">{project.description}</p>
                        </div>

                        {/* المعلومات الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Calendar className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100 ">السنة</p>
                                    <p className="font-semibold text-gray-300">{project.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Users className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100">عدد الأعضاء</p>
                                    <p className="font-semibold text-gray-300">{project.membersCount || 0} أعضاء</p>
                                </div>
                            </div>
                        </div>

                        {/* الجامعة والقسم والدكتور */}
                        <div className="space-y-3">
                            {/* <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-600">account_balance</span>
                                <div>
                                    <p className="text-xs text-white">الجامعة</p>
                                    <p className="font-semibold">{project.universityName}</p>
                                </div>
                            </div> */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-600">corporate_fare</span>
                                <div>
                                    <p className="text-xs text-white">القسم</p>
                                    <p className="font-semibold text-gray-300">{project.departmentName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-600">psychology</span>
                                <div>
                                    <p className="text-xs text-white">المشرف</p>
                                    <p className="font-semibold text-gray-300">{project.doctorName}</p>
                                </div>
                            </div>
                        </div>

                        {/* أعضاء الفريق */}
                        {project.membersNames && project.membersNames.length > 0 && (
                            <div>
                                <h4 className=" text-white font-semibold mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-red-600" />
                                    أعضاء الفريق
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.membersNames.map((member, idx) => (
                                        <span key={idx} className="text-white px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                            {member}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* التقنيات المستخدمة */}
                        {project.technologies && project.technologies.length > 0 && (
                            <div>
                                <h4 className=" text-white font-semibold mb-3 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-red-600" />
                                    التقنيات المستخدمة
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* رابط المشروع */}
                        {project.projectLink && (
                            <div>
                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4 text-red-600" />
                                    رابط المشروع
                                </h4>
                                <a
                                    href={project.projectLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {project.projectLink}
                                </a>
                            </div>
                        )}

                        {/* الملفات المرفقة */}
                        {project.files && project.files.length > 0 && (
                            <div>
                                <h4 className=" text-white  font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    الملفات المرفقة
                                </h4>
                                <div className="space-y-2">
                                    {project.files.map((file, idx) => (
                                        <a
                                            key={idx}
                                            href={file.filepath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className=" text-gray-300 flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <FileText className="w-4 h-4 text-red-600" />
                                            <span className="text-sm">{file.filename}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* تاريخ الإنشاء */}
                        <div className="text-xs text-white pt-4 border-t dark:border-gray-800">
                            تاريخ الإنشاء: {new Date(project.createdAt).toLocaleString('ar-EG')}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center text-white">
                        لا توجد تفاصيل لعرضها
                    </div>
                )}
            </div>
        </div>
    );
};  