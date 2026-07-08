// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import ProfileAdminService from '../features/Admin/AdminService/ProfileAdmin.service';

export const useProfile = () => {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [imageKey, setImageKey] = useState(Date.now());

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProfileAdminService.getProfile();
            console.log('📋 Profile loaded:', data);
            setProfile(data);
            setImageKey(Date.now());
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'فشل في تحميل الملف الشخصي');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (formData: any) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await ProfileAdminService.updateProfile(formData);
            console.log('✅ Profile updated:', updated);
            setProfile((prev: any) => ({ ...prev, ...updated }));
            setImageKey(Date.now());
            setSuccess('تم تحديث الملف الشخصي بنجاح');
            return true;
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'فشل في تحديث الملف الشخصي');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    // ✅ رفع الصورة - معاينة فورية + رفع في الخلفية
    const uploadAvatar = useCallback(async (file: File): Promise<boolean> => {
        if (file.size > 2 * 1024 * 1024) {
            setError('حجم الصورة كبير جداً. الحد الأقصى 2MB');
            return false;
        }
        
        if (!file.type.startsWith('image/')) {
            setError('يرجى اختيار ملف صورة صالح');
            return false;
        }

        setUploading(true);
        setError(null);
        
        try {
            const result = await ProfileAdminService.uploadAvatar(file);
            console.log('✅ Upload result:', result);
            
            // تحديث الـ state بالصورة الجديدة
            setProfile((prev: any) => {
                if (!prev) return null;
                return {
                    ...prev,
                    profileImage: result.profileImage
                };
            });
            
            setImageKey(Date.now());
            setSuccess('تم تحديث الصورة بنجاح');
            return true;
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'فشل في رفع الصورة');
            return false;
        } finally {
            setUploading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    // باقي الدوال كما هي...
    const changePassword = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            await ProfileAdminService.changePassword(data);
            setSuccess('تم تغيير كلمة المرور بنجاح');
            return true;
        } catch (err: any) {
            console.error('Error changing password:', err);
            setError(err.response?.data?.message || 'فشل في تغيير كلمة المرور');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    const toggleTwoFactor = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { enabled } = await ProfileAdminService.toggleTwoFactor();
            setProfile((prev: any) => prev ? { ...prev, twoFactorEnabled: enabled } : null);
            setSuccess(enabled ? 'تم تفعيل المصادقة الثنائية' : 'تم إلغاء المصادقة الثنائية');
            return true;
        } catch (err: any) {
            console.error('Error toggling two-factor:', err);
            setError(err.response?.data?.message || 'فشل في تغيير إعدادات المصادقة');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    const backupData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await ProfileAdminService.backupData();
            setSuccess(result.message);
            if (result.downloadUrl) {
                window.open(result.downloadUrl, '_blank');
            }
            return true;
        } catch (err: any) {
            console.error('Error backing up data:', err);
            setError(err.response?.data?.message || 'فشل في إنشاء النسخة الاحتياطية');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    const exportData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const blob = await ProfileAdminService.exportData();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `profile-data-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setSuccess('تم تصدير البيانات بنجاح');
            return true;
        } catch (err: any) {
            console.error('Error exporting data:', err);
            setError(err.response?.data?.message || 'فشل في تصدير البيانات');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await ProfileAdminService.deleteAccount();
            setSuccess('تم حذف الحساب بنجاح');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return true;
        } catch (err: any) {
            console.error('Error deleting account:', err);
            setError(err.response?.data?.message || 'فشل في حذف الحساب');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        uploading,
        error,
        success,
        imageKey,
        updateProfile,
        uploadAvatar,
        changePassword,
        toggleTwoFactor,
        backupData,
        exportData,
        deleteAccount,
        refetch: fetchProfile,
    };
};