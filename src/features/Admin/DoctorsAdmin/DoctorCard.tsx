// src/features/Admin/DoctorsAdmin/DoctorCard.tsx
import React, { useState } from 'react';
import type { Doctor } from '../AdminTypes/Doctor.interface';
import { doctorService } from '../AdminService/Doctor.service';
import { ConfirmModal } from './ConfirmModal';

interface DoctorCardProps {
    doctor: Doctor;
    onRefresh: () => void;
}

const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5'];

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onRefresh }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showRemoveHeadModal, setShowRemoveHeadModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const getInitials = (name: string) => {
        const cleanName = name.replace('د.', '').trim();
        const parts = cleanName.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`;
        }
        return cleanName.slice(0, 2);
    };

    const gradientClass = gradients[Math.abs(doctor._id?.length || 0) % gradients.length];

    const isDeleted = doctor.isDeleted || doctor.status === 'deleted';
    const isHead = doctor.departments?.some(dept => dept.isHead) || false;
    const departmentName = doctor.departments?.[0]?.departmentName || 'لا يوجد قسم';
    const academicTitle = doctor.academicTitle || 'أستاذ مساعد';

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await doctorService.delete(doctor._id);
            onRefresh();
        } catch (error) {
            console.error('Error deleting doctor:', error);
        } finally {
            setActionLoading(false);
            setShowDeleteModal(false);
        }
    };

    const handleRestore = async () => {
        setActionLoading(true);
        try {
            await doctorService.restore(doctor._id);
            onRefresh();
        } catch (error) {
            console.error('Error restoring doctor:', error);
        } finally {
            setActionLoading(false);
            setShowRestoreModal(false);
        }
    };

    const handleRemoveHead = async () => {
        setActionLoading(true);
        try {
            await doctorService.removeHead(doctor._id);
            onRefresh();
        } catch (error) {
            console.error('Error removing head:', error);
        } finally {
            setActionLoading(false);
            setShowRemoveHeadModal(false);
        }
    };

    return (
        <>
            <div className={`card-hover bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl ${isDeleted ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                    {/* الصورة الرمزية */}
                    <div className={`w-20 h-20 ${gradientClass} rounded-xl flex items-center justify-center text-white font-bold text-xl relative`}>
                        <span>{getInitials(doctor.fullName)}</span>
                        {!isDeleted && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                                <span className="material-symbols-outlined text-xs">verified</span>
                            </span>
                        )}
                    </div>

                    {/* المحتوى */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    د. {doctor.fullName}
                                    <span className="text-sm font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                        {academicTitle}
                                    </span>
                                    {isHead && (
                                        <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                            رئيس القسم
                                        </span>
                                    )}
                                    {isDeleted && (
                                        <span className="text-sm px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                                            محذوف
                                        </span>
                                    )}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{departmentName}</p>
                            </div>
                        </div>

                        {/* الإحصائيات */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">المشاريع</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{doctor.stats?.projectsCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">الطلاب</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{doctor.stats?.studentsCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">الفرق</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{doctor.stats?.teamsCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">البريد</p>
                                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{doctor.email}</p>
                            </div>
                        </div>

                        {/* معلومات الاتصال والأزرار */}
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined text-sm align-middle ml-1">mail</span>
                                {doctor.email}
                                {doctor.phoneNumber && (
                                    <span className="mr-4">
                                        <span className="material-symbols-outlined text-sm align-middle ml-1">phone</span>
                                        {doctor.phoneNumber}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => console.log('view', doctor._id)} 
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                    title="عرض التفاصيل"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </button>
                                {!isDeleted && isHead && (
                                    <button 
                                        onClick={() => setShowRemoveHeadModal(true)} 
                                        className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
                                        title="إلغاء منصب رئيس القسم"
                                    >
                                        <span className="material-symbols-outlined">star</span>
                                    </button>
                                )}
                                {isDeleted ? (
                                    <button 
                                        onClick={() => setShowRestoreModal(true)} 
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                        title="استعادة"
                                    >
                                        <span className="material-symbols-outlined">undo</span>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowDeleteModal(true)} 
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                        title="حذف"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* مودال الحذف */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="حذف دكتور"
                message={`هل أنت متأكد من حذف الدكتور ${doctor.fullName}؟`}
                confirmText="حذف"
                cancelText="إلغاء"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={actionLoading}
            />

            {/* مودال الاستعادة */}
            <ConfirmModal
                isOpen={showRestoreModal}
                title="استعادة دكتور"
                message={`هل أنت متأكد من استعادة الدكتور ${doctor.fullName}؟`}
                confirmText="استعادة"
                cancelText="إلغاء"
                onConfirm={handleRestore}
                onCancel={() => setShowRestoreModal(false)}
                loading={actionLoading}
            />

            {/* مودال إلغاء رئاسة القسم */}
            <ConfirmModal
                isOpen={showRemoveHeadModal}
                title="إلغاء منصب رئيس القسم"
                message={`هل أنت متأكد من إلغاء منصب رئيس القسم عن الدكتور ${doctor.fullName}؟`}
                confirmText="تأكيد"
                cancelText="إلغاء"
                onConfirm={handleRemoveHead}
                onCancel={() => setShowRemoveHeadModal(false)}
                loading={actionLoading}
            />
        </>
    );
};