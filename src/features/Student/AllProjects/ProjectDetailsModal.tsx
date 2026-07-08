// src/features/Student/components/ProjectDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Calendar, Users, Code, Link as LinkIcon, FileText, Star, Calendar as CalendarIcon, Clock,  School, UserCheck } from 'lucide-react';
import StudentProjectService from '../services/studentProjectService';
import type { Project } from '../types/project.types';

interface ProjectDetailsModalProps {
    projectId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ projectId, isOpen, onClose }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'technologies' | 'documents' | 'reviews'>('overview');

    useEffect(() => {
        if (isOpen && projectId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await StudentProjectService.getProjectById(projectId);
                    setProject(response.data);
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
            case 'completed': return 'مكتمل 100%';
            case 'in-progress': return 'قيد التنفيذ';
            case 'start': return 'جاري العمل';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in-progress': return 'bg-yellow-500';
            case 'start': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getProjectTypeText = (type: string) => {
        switch (type) {
            case 'web': return 'تطبيق ويب';
            case 'mobile': return 'تطبيق جوال';
            case 'desktop': return 'تطبيق سطح مكتب';
            default: return type;
        }
    };

    const getProjectImage = () => {
        if (project?.projectImage) return project.projectImage;
        const images = {
            'web': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'mobile': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'desktop': 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        };
        return images[project?.projectType as keyof typeof images] || images.web;
    };

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: 'info' },
        { id: 'team', label: 'فريق العمل', icon: 'group' },
        { id: 'technologies', label: 'التقنيات', icon: 'code' },
        { id: 'documents', label: 'المستندات', icon: 'description' },
        { id: 'reviews', label: 'التقييمات', icon: 'reviews' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        تفاصيل المشروع
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                        <X className="cursor-pointer w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : project ? (
                    <div>
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row gap-6 p-6 border-b dark:border-gray-800">
                            {/* Project Image */}
                            <div className="lg:w-2/3">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                                    <div 
                                        className="bg-center bg-no-repeat aspect-video bg-cover"
                                        style={{ backgroundImage: `url("${getProjectImage()}")` }}
                                    />
                                </div>
                            </div>
                            
                            {/* Project Info */}
                            <div className="lg:w-1/3">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`${getStatusColor(project.projectStatus)} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                                            {getStatusText(project.projectStatus)}
                                        </div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {getProjectTypeText(project.projectType)}
                                        </div>
                                    </div>
                                    
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {project.projectTitle}
                                    </h1>
                                    
                                    <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
                                        {project.projectDescription}
                                    </p>
                                    
                                    {/* Rating */}                                    
                                    {/* Project Details */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">سنة المشروع</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{project.projectYear}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            {/* <Category className="w-5 h-5 text-blue-600" /> */}
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">نوع المشروع</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{getProjectTypeText(project.projectType)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <School className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">الجامعة</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{project.universityName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    {project.projectLink && (
                                        <a 
                                            href={project.projectLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 mb-3"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            <span>عرض المشروع الحي</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 mx-6 mt-6">
                            <div className="flex overflow-x-auto gap-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                        className={`cursor-pointer flex-shrink-0 px-4 py-2 rounded-xl text-center font-medium transition-all duration-200 flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Project Description */}
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                            <span className="material-symbols-outlined text-blue-600 ">description</span>
                                            وصف المشروع
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {project.projectDescription}
                                        </p>
                                        {project.projectMainObjectives && (
                                            <>
                                                <h4 className="font-bold mt-4 mb-2 text-gray-900 dark:text-white">المميزات الرئيسية:</h4>
                                                <p className="text-gray-600 dark:text-gray-300">{project.projectMainObjectives}</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Supervisor Info */}
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                            <UserCheck className="w-5 h-5 text-blue-600" />
                                            المشرف الأكاديمي
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-blue-600/30"
                                                style={{ 
                                                    backgroundImage: project.doctorImage 
                                                        ? `url("${project.doctorImage}")` 
                                                        : `url("https://ui-avatars.com/api/?name=${project.doctorFullName}&background=random&size=64")`
                                                }}
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">د. {project.doctorFullName}</h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">مشرف المشروع</p>
                                                <div className="flex gap-3 mt-2">
                                                    <a href={`mailto:${project.doctorEmail}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {project.doctorEmail}
                                                    </a>
                                                    {project.doctorPhone && (
                                                        <a href={`tel:${project.doctorPhone}`} className="text-sm text-gray-500 hover:underline flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {project.doctorPhone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Team Tab */}
                            {activeTab === 'team' && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        فريق العمل ({project.teamMembers?.length || 0} أعضاء)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {project.teamMembers?.map((member) => (
                                            <div key={member.memberId} className="bg-white dark:bg-gray-900 rounded-xl p-4 card-hover">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div 
                                                        className="w-12 h-12 rounded-full bg-cover bg-center"
                                                        style={{ 
                                                            backgroundImage: member.memberProfileImage 
                                                                ? `url("${member.memberProfileImage}")` 
                                                                : `url("https://ui-avatars.com/api/?name=${member.memberFullName}&background=random&size=48")`
                                                        }}
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                                            {member.memberFullName}
                                                            {member.memberIsLeader && (
                                                                <span className="text-xs text-yellow-600 mr-2">قائد</span>
                                                            )}
                                                        </h4>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{member.memberRole}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a href={`mailto:${member.memberEmail}`} className="text-xs text-blue-600 hover:underline">
                                                        {member.memberEmail}
                                                    </a>
                                                    {member.memberPhone && (
                                                        <a href={`tel:${member.memberPhone}`} className="text-xs text-gray-500 hover:underline">
                                                            {member.memberPhone}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Technologies Tab */}
                            {activeTab === 'technologies' && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <Code className="w-5 h-5 text-blue-600" />
                                        التقنيات المستخدمة
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies?.map((tech, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Documents Tab */}
                            {activeTab === 'documents' && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        المستندات والملفات
                                    </h3>
                                    {project.files && project.files.length > 0 ? (
                                        <div className="space-y-3">
                                            {project.files.map((file, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={file.filepath} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-all"
                                                >
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-700 dark:text-gray-300">{file.filename}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">لا توجد مستندات مرفقة</p>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                        <Star className="w-5 h-5 text-blue-600" />
                                        التقييمات والمراجعات
                                    </h3>
                                    <div className="text-center py-8">
                                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">لا توجد تقييمات بعد</p>
                                        <p className="text-sm text-gray-400 mt-1">كن أول من يقيم هذا المشروع</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        لا توجد تفاصيل لعرضها
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsModal;