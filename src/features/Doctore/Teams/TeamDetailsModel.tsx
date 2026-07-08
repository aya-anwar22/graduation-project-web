// components/TeamDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { getTeamDetails, updateProjectStatusWithFetch } from '../DoctorServices/teamsService';
import { toast } from 'react-toastify';

interface Member {
    userId: string;
    role: string;
    fullName: string;
    profileImage: string;
}

interface TeamDetails {
    _id: string;
    teamName: string;
    teamCode: string;
    projectTitle: string;
    projectDescription: string;
    projectStatus: 'start' | 'in_progress' | 'completed';
    projectYear: string;
    universityId: string;
    universityName: string;
    departmentId: string;
    departmentName: string;
    members: Member[];
    projectId: string; // ✅ تأكد من وجود projectId في البيانات
}

interface TeamDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamId: string | null;
    onStatusUpdate?: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ 
    isOpen, 
    onClose, 
    teamId,
    onStatusUpdate 
}) => {
    const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<TeamDetails['projectStatus']>('start');

    // حساب عدد الأعضاء الفريدين (إزالة التكرار)
    const getUniqueMembers = (members: Member[]): Member[] => {
        const uniqueMap = new Map();
        members.forEach(member => {
            if (!uniqueMap.has(member.userId)) {
                uniqueMap.set(member.userId, member);
            }
        });
        return Array.from(uniqueMap.values());
    };

    // عد الأعضاء حسب الدور
    const countMembersByRole = (members: Member[]) => {
        const uniqueMembers = getUniqueMembers(members);
        const leaders = uniqueMembers.filter(m => m.role === 'Leader').length;
        const developers = uniqueMembers.filter(m => m.role === 'developer' || m.role === 'member').length;
        
        return {
            total: uniqueMembers.length,
            leaders,
            developers,
            hasDuplicate: members.length !== uniqueMembers.length
        };
    };

    useEffect(() => {
        if (isOpen && teamId) {
            fetchTeamDetails();
        }
    }, [isOpen, teamId]);

    const fetchTeamDetails = async () => {
        if (!teamId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getTeamDetails(teamId);
            console.log('📥 Team details response:', response);
            
            if (response.success) {
                setTeamDetails(response.data);
                setSelectedStatus(response.data.projectStatus);
                
                // ✅ تأكد من وجود projectId
                console.log('📌 Project ID:', response.data.projectId);
                console.log('📌 Team ID:', response.data._id);
            } else {
                setError('فشل في تحميل بيانات الفريق');
            }
        } catch (error) {
            setError('حدث خطأ في تحميل البيانات');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ دالة تغيير الحالة - استخدام projectId
    const handleStatusChange = async (newStatus: TeamDetails['projectStatus']) => {
        if (!teamId || !teamDetails) {
            toast.error('❌ لا توجد بيانات كافية');
            return;
        }

        // ✅ استخدم projectId من بيانات الفريق
        const projectId = teamDetails.projectId;
        
        if (!projectId) {
            toast.error('❌ لا يوجد Project ID مرتبط بهذا الفريق');
            console.error('❌ teamDetails:', teamDetails);
            return;
        }

        if (newStatus === teamDetails.projectStatus) {
            toast.info('الحالة الحالية هي نفسها');
            return;
        }

        console.log('📤 Updating status:', {
            projectId,
            teamId,
            newStatus,
            currentStatus: teamDetails.projectStatus
        });

        setUpdatingStatus(true);
        try {
            // ✅ استخدم projectId وليس teamId
            await updateProjectStatusWithFetch(projectId, newStatus);
            
            // ✅ تحديث البيانات محلياً
            setTeamDetails(prev => prev ? { ...prev, projectStatus: newStatus } : null);
            setSelectedStatus(newStatus);
            
            toast.success(`✅ تم تغيير حالة المشروع إلى ${getStatusColor(newStatus).label}`);
            
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('❌ فشل في تغيير حالة المشروع');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // الحصول على أول حرفين من الاسم
    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    // الحصول على لون الحالة
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'start':
                return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'بداية' };
            case 'in_progress':
                return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'قيد التنفيذ' };
            case 'completed':
                return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'مكتمل' };
            default:
                return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: 'غير معروف' };
        }
    };

    // حالة التحميل الأولي
    if (loading && !teamDetails) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل بيانات الفريق...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {error ? (
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
                    ) : teamDetails && (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {teamDetails.teamName}
                                </h3>
                                <button 
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Team Info */}
                                <div className="lg:col-span-2">
                                    {/* Team Overview */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
                                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                                    {teamDetails.teamName.substring(0, 2)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                            {teamDetails.teamName}
                                                        </h4>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                <span className="material-symbols-outlined text-sm">qr_code</span>
                                                                <span className="text-sm">{teamDetails.teamCode}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                                <span className="text-sm">{teamDetails.projectYear}</span>
                                                            </span>
                                                            {/* ✅ عرض Project ID للتصحيح */}
                                                            <span className="text-xs text-gray-400">
                                                                Project: {teamDetails.projectId?.substring(0, 8)}...
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teamDetails.projectStatus).bg} ${getStatusColor(teamDetails.projectStatus).text}`}>
                                                            {getStatusColor(teamDetails.projectStatus).label}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* زر تغيير الحالة */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        تغيير حالة المشروع
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange('start')}
                                                            disabled={updatingStatus || teamDetails.projectStatus === 'start'}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                teamDetails.projectStatus === 'start'
                                                                    ? 'bg-yellow-500 text-white cursor-default'
                                                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                                                            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            بداية
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange('in_progress')}
                                                            disabled={updatingStatus || teamDetails.projectStatus === 'in_progress'}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                teamDetails.projectStatus === 'in_progress'
                                                                    ? 'bg-green-500 text-white cursor-default'
                                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                                                            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            قيد التنفيذ
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange('completed')}
                                                            disabled={updatingStatus || teamDetails.projectStatus === 'completed'}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                teamDetails.projectStatus === 'completed'
                                                                    ? 'bg-blue-500 text-white cursor-default'
                                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                                            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        >
                                                            مكتمل
                                                        </button>
                                                        
                                                        {updatingStatus && (
                                                            <div className="flex items-center gap-2 px-4 py-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                                                <span className="text-sm text-gray-500">جاري التحديث...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">المشروع</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {teamDetails.projectTitle}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">حالة المشروع</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {getStatusColor(teamDetails.projectStatus).label}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">الجامعة</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {teamDetails.universityName}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">القسم</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {teamDetails.departmentName}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* وصف المشروع */}
                                                {teamDetails.projectDescription && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">وصف المشروع</p>
                                                        <p className="text-gray-700 dark:text-gray-300">
                                                            {teamDetails.projectDescription}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Team Members */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                                                أعضاء الفريق
                                            </h4>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                                    الإجمالي: {countMembersByRole(teamDetails.members).total}
                                                </span>
                                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm">
                                                    قائد: {countMembersByRole(teamDetails.members).leaders}
                                                </span>
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                                                    مطور: {countMembersByRole(teamDetails.members).developers}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {countMembersByRole(teamDetails.members).hasDuplicate && (
                                            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                    ملاحظة: يوجد {teamDetails.members.length - countMembersByRole(teamDetails.members).total} عضو مكرر في البيانات
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getUniqueMembers(teamDetails.members).map((member, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    {member.profileImage ? (
                                                        <img 
                                                            src={member.profileImage} 
                                                            alt={member.fullName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                                            {getInitials(member.fullName)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-gray-800 dark:text-white font-medium">{member.fullName}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                                                    </div>
                                                    {member.role === 'Leader' && (
                                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-xs">
                                                            قائد
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Additional Info */}
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">إحصائيات الفريق</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">إجمالي الأعضاء:</span>
                                                <span className="text-gray-800 dark:text-white font-bold">
                                                    {countMembersByRole(teamDetails.members).total}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">قادة الفريق:</span>
                                                <span className="text-gray-800 dark:text-white font-bold">
                                                    {countMembersByRole(teamDetails.members).leaders}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">المطورين:</span>
                                                <span className="text-gray-800 dark:text-white font-bold">
                                                    {countMembersByRole(teamDetails.members).developers}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">معلومات المشروع</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">كود الفريق</p>
                                                <p className="text-gray-800 dark:text-white font-mono">{teamDetails.teamCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">السنة</p>
                                                <p className="text-gray-800 dark:text-white">{teamDetails.projectYear}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">الحالة</p>
                                                <p className="text-gray-800 dark:text-white">{getStatusColor(teamDetails.projectStatus).label}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project ID</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                                                    {teamDetails.projectId || 'غير متاح'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 mt-8 pt-6 border-t dark:border-gray-700">
                                <button 
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsModal;