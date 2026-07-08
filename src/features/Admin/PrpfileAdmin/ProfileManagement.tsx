// src/features/Admin/PrpfileAdmin/ProfileManagement.tsx
import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { AccountInfo } from './AccountInfo';
import { SecurityActions } from './SecurityActions';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useProfile } from '../../../hooks/useProfileAdmin';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';
import { Alert } from '../../../components/common/Alert';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';

export const ProfileManagement: React.FC = () => {
    const {
        profile,
        loading,
        uploading,
        imageKey,  // ✅ استخدم uploading
        error,
        success,
        updateProfile,
        uploadAvatar,
        changePassword,
        toggleTwoFactor,
        backupData,
        exportData,
        deleteAccount,
    } = useProfile();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showBackupDialog, setShowBackupDialog] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        await deleteAccount();
        setIsDeleting(false);
        setShowDeleteDialog(false);
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        await backupData();
        setIsBackingUp(false);
        setShowBackupDialog(false);
    };

    const handleAvatarUpload = async (file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            alert('حجم الصورة كبير جداً. الحد الأقصى 2MB');
            return false;
        }
        if (!file.type.startsWith('image/')) {
            alert('يرجى اختيار ملف صورة صالح');
            return false;
        }
        const ok = await uploadAvatar(file);
        return ok;
    };

    if (loading && !profile) {
        return <LoadingSpinner />;
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
                {success && <Alert type="success" message={success} onClose={() => { }} />}
                {error && <Alert type="error" message={error} onClose={() => { }} />}

                {/* Profile Cover & Avatar */}
                <ProfileHeader
                    profile={profile}
                    onAvatarUpload={handleAvatarUpload}
                    loading={loading}
                    uploading={uploading}  // ✅ تمرير uploading
                    imageKey={imageKey}
                />

                {/* Profile Info */}
                <div className="px-6 pt-20 pb-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {profile?.fullName || 'مدير النظام'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {profile?.email || 'admin@system.com'}
                        </p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <span className="px-4 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">shield</span>
                                {profile?.role === 'admin' ? 'مدير النظام' : 'مدير عام'}
                            </span>
                            {profile?.isVerified && (
                                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    موثق
                                </span>
                            )}
                            {profile?.status === 'active' && (
                                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">circle</span>
                                    نشط
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl mx-auto"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                تعديل الملف الشخصي
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <ProfileStats profile={profile} />
                            <AccountInfo profile={profile} />
                        </div>
                        <div className="space-y-6">
                            <SecurityActions
                                onOpenChangePassword={() => setIsPasswordModalOpen(true)}
                                onToggleTwoFactor={toggleTwoFactor}
                                onBackup={() => setShowBackupDialog(true)}
                                onExport={exportData}
                                onDeleteAccount={() => setShowDeleteDialog(true)}
                                twoFactorEnabled={profile?.twoFactorEnabled || false}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={updateProfile}
                profile={profile}
                loading={loading}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={changePassword}
                loading={loading}
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteAccount}
                message="هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع بياناتك."
            />

            <ConfirmationDialog
                isOpen={showBackupDialog}
                onClose={() => setShowBackupDialog(false)}
                onConfirm={handleBackup}
                message="هل تريد إنشاء نسخة احتياطية من البيانات؟"
            />
        </main>
    );
};