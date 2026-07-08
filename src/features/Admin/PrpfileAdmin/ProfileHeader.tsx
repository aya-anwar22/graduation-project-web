// src/features/Admin/PrpfileAdmin/ProfileHeader.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
    profile: any | null;
    onAvatarUpload: (file: File) => Promise<boolean>;
    loading: boolean;
    uploading?: boolean;
    uploadError?: string | null;
    uploadSuccess?: boolean;
    imageKey?: number;
}

export const ProfileHeader: React.FC<Props> = ({ 
    profile, 
    onAvatarUpload, 
    loading,
    uploading = false,
    uploadError = null,
    uploadSuccess = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [localUploading, setLocalUploading] = useState(false);
    const [localSuccess, setLocalSuccess] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    // متابعة حالة الرفع من الـ parent
    useEffect(() => {
        if (!uploading && localUploading) {
            if (uploadSuccess) {
                setLocalSuccess(true);
                // بعد 2 ثانية، نزيل رسالة النجاح ونعرض الصورة النهائية
                setTimeout(() => {
                    setLocalSuccess(false);
                    setIsPreviewing(false);
                    setPreviewImage(null);
                }, 2000);
            }
            if (uploadError) {
                setLocalError(uploadError);
                setTimeout(() => {
                    setLocalError(null);
                }, 3000);
            }
            setLocalUploading(false);
        }
    }, [uploading, uploadSuccess, uploadError, localUploading]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // التحقق من حجم الصورة
        if (file.size > 2 * 1024 * 1024) {
            setLocalError('حجم الصورة كبير جداً. الحد الأقصى 2MB');
            setTimeout(() => setLocalError(null), 3000);
            return;
        }

        // التحقق من نوع الصورة
        if (!file.type.startsWith('image/')) {
            setLocalError('يرجى اختيار ملف صورة صالح');
            setTimeout(() => setLocalError(null), 3000);
            return;
        }

        // ✅ 1. معاينة فورية
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setIsPreviewing(true);
            setLocalUploading(true);
            setLocalSuccess(false);
            setLocalError(null);
        };
        reader.readAsDataURL(file);
        
        // ✅ 2. رفع الصورة في الخلفية
        const success = await onAvatarUpload(file);
        
        if (!success) {
            // لو فشل الرفع، نرجع للصورة القديمة
            setIsPreviewing(false);
            setPreviewImage(null);
            setLocalUploading(false);
        }
        
        // reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ✅ تحديد الصورة المعروضة
    const displayImage = (() => {
        if (localError) {
            // لو في خطأ، نعرض الصورة القديمة
            return profile?.profileImage || `https://ui-avatars.com/api/?name=${profile?.fullName || 'Admin'}&size=150&background=e61919&color=fff&bold=true`;
        }
        if (isPreviewing && previewImage) {
            return previewImage;
        }
        if (profile?.profileImage && !isPreviewing) {
            return profile.profileImage;
        }
        return `https://ui-avatars.com/api/?name=${profile?.fullName || 'Admin'}&size=150&background=e61919&color=fff&bold=true`;
    })();

    return (
        <div className="profile-cover relative h-48 md:h-64 bg-gradient-to-r from-red-600 to-red-800 rounded-b-3xl">
            <div className="profile-avatar absolute -bottom-12 right-6 md:right-12">
                <div className="relative">
                    {/* صورة البروفايل */}
                    <div className="relative">
                        <img
                            src={displayImage}
                            alt="Profile"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                        />
                        
                        {/* ✅ Overlay التحميل */}
                        {(localUploading || uploading) && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                        
                        {/* ✅ علامة النجاح */}
                        {localSuccess && !localUploading && !uploading && (
                            <div className="absolute inset-0 bg-green-500/80 rounded-full flex items-center justify-center animate-pulse">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </div>
                    
                    {/* زر رفع الصورة */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading || localUploading || uploading}
                        className="absolute bottom-0 left-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="تغيير الصورة"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading || localUploading || uploading}
                    />
                </div>  
            </div>
            
            {/* ✅ رسالة الخطأ */}
            {localError && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4" />
                    {localError}
                </div>
            )}
            
            {/* ✅ رسالة النجاح */}
            {localSuccess && !localUploading && !uploading && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4" />
                    تم تحديث الصورة بنجاح
                </div>
            )}
        </div>
    );
};