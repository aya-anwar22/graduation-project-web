// components/RequestDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { getRequestDetails, updateRequestStatus } from '../DoctorServices/supervisionService';
import type { RequestDetails, TeamMember } from '../TypesDoctor/supervision.interface';

interface RequestDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: string | null;
    onStatusUpdate: (requestId: string, newStatus: 'approved' | 'rejected') => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, onClose, requestId, onStatusUpdate }) => {
    const [request, setRequest] = useState<RequestDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (isOpen && requestId) {
            fetchRequestDetails();
        }
    }, [isOpen, requestId]);

    const fetchRequestDetails = async () => {
        if (!requestId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getRequestDetails(requestId);
            if (response.success) {
                setRequest(response.data);
            } else {
                setError('فشل في تحميل بيانات الطلب');
            }
        } catch (error) {
            setError('حدث خطأ في تحميل البيانات');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        if (!requestId || !request) return;
        
        setUpdating(true);
        try {
            const response = await updateRequestStatus(requestId, 'approved');
            if (response.success) {
                onStatusUpdate(requestId, 'approved');
                onClose();
            } else {
                alert('فشل في قبول الطلب');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('حدث خطأ في قبول الطلب');
        } finally {
            setUpdating(false);
        }
    };

    const handleRejectRequest = async () => {
        if (!requestId || !request) return;
        
        setUpdating(true);
        try {
            const response = await updateRequestStatus(requestId, 'rejected');
            if (response.success) {
                onStatusUpdate(requestId, 'rejected');
                onClose();
            } else {
                alert('فشل في رفض الطلب');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('حدث خطأ في رفض الطلب');
        } finally {
            setUpdating(false);
        }
    };

    // الحصول على الحروف الأولى من الاسم
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return words[0][0].toUpperCase();
    };

    // الحصول على لون الحالة
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            case 'approved':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'معلق';
            case 'approved':
                return 'مقبول';
            case 'rejected':
                return 'مرفوض';
            default:
                return status;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل بيانات الطلب...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                إغلاق
                            </button>
                        </div>
                    ) : request && (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {request.projectName}
                                </h3>
                                <button 
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Project Header */}
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <img 
                                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                                            alt={request.projectName}
                                            className="w-48 h-48 rounded-2xl object-cover shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                    {request.projectName}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">school</span>
                                                        <span className="text-sm">{request.universityName}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">apartment</span>
                                                        <span className="text-sm">{request.departmentName}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                        <span className="text-sm">سنة {request.year}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`${getStatusColor(request.status)} px-4 py-2 rounded-full text-sm font-medium`}>
                                                    {getStatusLabel(request.status)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">نوع المشروع</p>
                                                <p className="text-gray-800 dark:text-white font-medium">{request.projectType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Description */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">وصف المشروع</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{request.projectDescription}</p>
                                </div>

                                {/* Objectives */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">الأهداف الرئيسية</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{request.mainObjectives}</p>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                                        أعضاء الفريق ({request.team.length})
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {request.team.map((member: TeamMember, index: number) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                {member.profileImage ? (
                                                    <img 
                                                        src={member.profileImage} 
                                                        alt={member.fullName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                                                        {getInitials(member.fullName)}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-gray-800 dark:text-white font-medium">{member.fullName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.contactEmail}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">الرقم الجامعي: {member.universityNumber}</p>
                                                </div>
                                                {member.isLeader && (
                                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs">
                                                        قائد الفريق
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">التقنيات المستخدمة</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {request.technologies.map((tech: string, index: number) => (
                                            <span 
                                                key={index}
                                                className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Prerequisites */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">المتطلبات الأساسية</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{request.prerequisites}</p>
                                </div>

                                {/* Additional Notes */}
                                {request.additionalNotes && (
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3">ملاحظات إضافية</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{request.additionalNotes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-6 border-t dark:border-gray-700">
                                    <button 
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        إغلاق
                                    </button>
                                    
                                    {request.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={handleAcceptRequest}
                                                disabled={updating}
                                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                {updating ? 'جاري...' : 'قبول الطلب'}
                                            </button>
                                            <button 
                                                onClick={handleRejectRequest}
                                                disabled={updating}
                                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                {updating ? 'جاري...' : 'رفض الطلب'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;