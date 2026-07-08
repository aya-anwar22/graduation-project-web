// pages/ProfileDoctor.tsx (سابقاً DoctorProfilePage.tsx)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { doctorProfileService } from '../DoctorServices/doctorProfileService';
import type { DoctorProfileData, ProfileStats, Specialization, UpdateDoctorProfileData } from '../TypesDoctor/doctorProfile.interfase';
import StatCard from '../Components/StatCard';
import { dismissToast, toastError, toastInfo, toastLoading, toastSuccess, toastWarning } from '../../../utlis/tost';

const ProfileDoctor: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State Management
    const [profileData, setProfileData] = useState<DoctorProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [stats, setStats] = useState<ProfileStats>({
        totalProjects: 0,
        totalStudents: 47,
        totalTeams: 0,
        pendingRequests: 0,
    });

    const [allSpecializations, setAllSpecializations] = useState<Specialization[]>([
        { id: 1, name: 'الذكاء الاصطناعي', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100', darkBgColor: 'dark:bg-blue-900/30', value: 'ai' },
        { id: 2, name: 'تطوير الويب', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100', darkBgColor: 'dark:bg-orange-900/30', value: 'web' },
        { id: 3, name: 'تعلم الآلة', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100', darkBgColor: 'dark:bg-purple-900/30', value: 'ml' },
        { id: 4, name: 'علم البيانات', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100', darkBgColor: 'dark:bg-green-900/30', value: 'data-science' },
        { id: 5, name: 'أمن المعلومات', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100', darkBgColor: 'dark:bg-red-900/30', value: 'cybersecurity' },
    ]);

    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editedData, setEditedData] = useState<UpdateDoctorProfileData>({});
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // تحميل بيانات الدكتور
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError(null);

                const profileResponse = await doctorProfileService.getDoctorProfile();
                if (profileResponse.success) {
                    setProfileData(profileResponse.data);
                    setSelectedSpecializations(profileResponse.data.academicInfo?.specialization || []);
                }

                const statsData = await doctorProfileService.getDoctorStats();
                setStats(statsData);

            } catch (err: any) {
                setError(err.message || 'حدث خطأ في تحميل بيانات الملف الشخصي');
                console.error('Error loading profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Handlers
    const handleOpenEditModal = () => {
        if (profileData) {
            setEditedData({
                fullName: profileData.fullName,
                phoneNumber: profileData.phoneNumber,
                bio: profileData.bio,
                academicInfo: {
                    academicTitle: profileData.academicInfo?.academicTitle,
                    academicDegree: profileData.academicInfo?.academicDegree,
                    yearsOfExperience: profileData.academicInfo?.yearsOfExperience,
                    specialization: profileData.academicInfo?.specialization
                }
            });
            setSelectedSpecializations(profileData.academicInfo?.specialization || []);
            setProfileImagePreview(profileData.profileImage);
            setProfileImageFile(null);
            setSaveError(null);
        }
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditedData({});
        setSelectedSpecializations([]);
        setProfileImageFile(null);
        setProfileImagePreview(null);
        setSaveError(null);
    };

    const handleSaveProfile = async () => {
        const toastId = toastLoading('جاري حفظ التعديلات...');

        try {
            setIsSaving(true);

            // تحضير البيانات
            const updateData: UpdateDoctorProfileData = {
                fullName: editedData.fullName || profileData?.fullName,
                phoneNumber: editedData.phoneNumber || profileData?.phoneNumber,
                bio: editedData.bio || profileData?.bio,
                academicInfo: {
                    academicTitle: editedData.academicInfo?.academicTitle || profileData?.academicInfo?.academicTitle,
                    academicDegree: editedData.academicInfo?.academicDegree || profileData?.academicInfo?.academicDegree,
                    yearsOfExperience: editedData.academicInfo?.yearsOfExperience || profileData?.academicInfo?.yearsOfExperience,
                    specialization: selectedSpecializations.length > 0 ? selectedSpecializations : profileData?.academicInfo?.specialization || []
                }
            };

            if (profileImageFile) {
                updateData.profileImage = profileImageFile;
            }

            // إرسال التحديث
            const updateResponse = await doctorProfileService.updateDoctorProfile(updateData);

            if (updateResponse.success) {
                // تحديث STATE فوراً
                if (profileData) {
                    const updatedProfile = {
                        ...profileData,
                        fullName: updateData.fullName || profileData.fullName,
                        phoneNumber: updateData.phoneNumber || profileData.phoneNumber,
                        bio: updateData.bio || profileData.bio,
                        profileImage: updateResponse.data.profileImage || profileData.profileImage,
                        academicInfo: {
                            ...profileData.academicInfo,
                            academicTitle: updateData.academicInfo?.academicTitle || profileData.academicInfo.academicTitle,
                            academicDegree: updateData.academicInfo?.academicDegree || profileData.academicInfo.academicDegree,
                            yearsOfExperience: updateData.academicInfo?.yearsOfExperience || profileData.academicInfo.yearsOfExperience,
                            specialization: selectedSpecializations.length > 0 ? selectedSpecializations : profileData.academicInfo.specialization,
                            updatedAt: new Date().toISOString()
                        }
                    };
                    setProfileData(updatedProfile);
                }

                // إغلاق المودال
                handleCloseEditModal();

                // رسالة النجاح
                dismissToast(toastId);
                toastSuccess(' تم تحديث البيانات بنجاح');

                // تحميل خلفي للتأكد
                setTimeout(async () => {
                    try {
                        const freshData = await doctorProfileService.getDoctorProfile();
                        if (freshData.success && JSON.stringify(freshData.data) !== JSON.stringify(profileData)) {
                            setProfileData(freshData.data);
                            // toastInfo('🔄 تم مزامنة البيانات مع السيرفر');
                        }
                    } catch (error) {
                        // تجاهل الأخطاء في الخلفية
                    }
                }, 1500);
            }
        } catch (err: any) {
            console.error('Error saving profile:', err);
            dismissToast(toastId);
            toastError(`❌ ${err.message || 'فشل في حفظ التعديلات'}`);
        } finally {
            setIsSaving(false);
        }
    };
    const handleInputChange = (field: keyof UpdateDoctorProfileData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAcademicInfoChange = (field: string, value: string | number) => {
        setEditedData(prev => ({
            ...prev,
            academicInfo: {
                ...prev.academicInfo,
                [field]: value
            }
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // التحقق من حجم ونوع الصورة
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

            if (!allowedTypes.includes(file.type)) {
                toastWarning('نوع الملف غير مدعوم. الرجاء رفع صورة بصيغة JPG, PNG أو GIF.');
                return;
            }

            if (file.size > maxSize) {
                toastWarning('حجم الصورة كبير جداً. الحد الأقصى 5MB.');
                return;
            }

            setProfileImageFile(file);

            // إنشاء معاينة للصورة
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTriggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSpecializationToggle = (value: string) => {
        setSelectedSpecializations(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const formatExperience = (years: number) => {
        return `${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
    };

    // Loading State
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري تحميل بيانات الملف الشخصي...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <Icon icon="mdi:alert-circle" className="text-4xl text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">حدث خطأ</h3>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // الحصول على تخصصات الدكتور من البيانات للعرض
    const doctorSpecializations = allSpecializations.filter(spec =>
        profileData?.academicInfo?.specialization?.includes(spec.value) || false
    );

    // Render Profile
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 animate-slide-in">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Profile Information */}
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 relative z-10">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-32 border-4 border-white dark:border-gray-800 shadow-xl"
                                style={{
                                    backgroundImage: `url(${profileData?.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib= rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'})`
                                }}
                            >
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity cursor-pointer">
                                    <Icon icon="mdi:camera" className="text-white text-2xl" />
                                </div>
                            </div>
                        </div>

                        {/* Name and Title */}
                        <div className="flex-1 mt-4 md:mt-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    {profileData?.fullName || 'د. ساره علي'}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium">
                                    <Icon icon="mdi:check-decagram" className="text-sm" />
                                    موثق
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                                {profileData?.academicInfo?.academicTitle || 'أستاذ مساعد'}
                            </p>

                            {/* Additional Info */}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Icon icon="mdi:briefcase-clock" className="text-sm" />
                                    <span>الخبرة: {formatExperience(profileData?.academicInfo?.yearsOfExperience || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Icon icon="mdi:email" className="text-sm" />
                                    <span>{profileData?.email || 'doc.se@gmail.com'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleOpenEditModal}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                                aria-label="تعديل الملف الشخصي"
                                title="تعديل الملف الشخصي"
                            >
                                <Icon icon="mdi:pencil" className="text-sm" aria-hidden="true" />
                                تعديل الملف
                            </button>

                            <button
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 hover:border-orange-500 text-gray-700 dark:text-gray-300 hover:text-orange-600 rounded-lg font-medium transition-colors"
                                aria-label="مشاركة الملف الشخصي"
                                title="مشاركة الملف الشخصي"
                            >
                                <Icon icon="mdi:share" className="text-sm" aria-hidden="true" />
                                مشاركة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="إجمالي المشاريع"
                    value={stats.totalProjects}
                    icon="mdi:folder-multiple"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100"
                    darkBgColor="dark:bg-blue-900/20"
                />

                <StatCard
                    title="الطلاب"
                    value={stats.totalStudents}
                    icon="mdi:account-group"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-100"
                    darkBgColor="dark:bg-green-900/20"
                />

                <StatCard
                    title="إجمالي الفرق"
                    value={stats.totalTeams}
                    icon="mdi:account-group"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-100"
                    darkBgColor="dark:bg-green-900/20"
                />

                <StatCard
                    title="الطلبات المعلقة"
                    value={stats.pendingRequests}
                    icon="mdi:bell-alert"
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-100"
                    darkBgColor="dark:bg-orange-900/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="mdi:information" aria-hidden="true" />
                            نبذة عني
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {profileData?.bio || 'لا توجد نبذة شخصية'}
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="mdi:contact-mail" aria-hidden="true" />
                            معلومات التواصل
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Icon icon="mdi:email" className="text-orange-500" aria-hidden="true" />
                                <span>{profileData?.email || 'doc.se@gmail.com'}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Icon icon="mdi:phone" className="text-orange-500" aria-hidden="true" />
                                <span>{profileData?.phoneNumber || '01000000000'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Specializations */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Icon icon="mdi:brain" aria-hidden="true" />
                                التخصصات
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {doctorSpecializations.length > 0 ? (
                                doctorSpecializations.map((spec) => (
                                    <div key={spec.id} className="relative group">
                                        <span
                                            className={`px-4 py-2 ${spec.bgColor} ${spec.darkBgColor} ${spec.color} rounded-lg text-sm font-medium transition-transform hover:-translate-y-0.5`}
                                            aria-label={`تخصص: ${spec.name}`}
                                        >
                                            {spec.name}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">لا توجد تخصصات محددة</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Academic Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="mdi:school" aria-hidden="true" />
                            معلومات أكاديمية
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-500">الدرجة العلمية</p>
                                <p className="text-base font-semibold text-gray-800 dark:text-white mt-1">
                                    {profileData?.academicInfo?.academicDegree || 'دكتوراه في علوم الحاسب'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-500">المسمى الوظيفي</p>
                                <p className="text-base font-semibold text-gray-800 dark:text-white mt-1">
                                    {profileData?.academicInfo?.academicTitle || 'أستاذ مساعد'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-500">سنوات الخبرة</p>
                                <p className="text-base font-semibold text-gray-800 dark:text-white mt-1">
                                    {formatExperience(profileData?.academicInfo?.yearsOfExperience || 15)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-500">تاريخ التحديث</p>
                                <p className="text-base font-semibold text-gray-800 dark:text-white mt-1">
                                    {new Date(profileData?.academicInfo?.updatedAt || Date.now()).toLocaleDateString('ar-EG')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Research Papers */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Icon icon="mdi:file-document" aria-hidden="true" />
                            الأنشطة البحثية
                        </h2>

                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <h3 className="font-medium text-gray-800 dark:text-white">نشر الأبحاث العلمية</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مجلات علمية محكمة</p>
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <h3 className="font-medium text-gray-800 dark:text-white">إشراف على مشاريع التخرج</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مشاريع طلابية مميزة</p>
                            </div>

                            <button
                                className="w-full p-2 text-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium hover:underline"
                                aria-label="عرض جميع الأنشطة البحثية"
                                onClick={() => navigate('/research-activities')}
                            >
                                عرض جميع الأنشطة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Icon icon="mdi:pencil" className="text-orange-500" />
                                تعديل الملف الشخصي
                            </h2>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="إغلاق"
                            >
                                <Icon icon="mdi:close" className="text-2xl" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-32 border-4 border-white dark:border-gray-800 shadow-xl"
                                        style={{
                                            backgroundImage: `url(${profileImagePreview || profileData?.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80'})`
                                        }}
                                    />
                                    <button
                                        onClick={handleTriggerImageUpload}
                                        className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
                                        aria-label="تغيير الصورة"
                                    >
                                        <Icon icon="mdi:camera" className="text-lg" />
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                    aria-label="رفع صورة جديدة"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    انقر على الأيقونة لتغيير الصورة الشخصية<br />
                                    <span className="text-xs">(JPG, PNG, GIF - الحد الأقصى 5MB)</span>
                                </p>
                            </div>

                            {/* Error Message */}
                            {saveError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <Icon icon="mdi:alert-circle" className="text-lg" />
                                        <span className="font-medium">خطأ في الحفظ:</span>
                                    </div>
                                    <p className="text-red-500 dark:text-red-300 text-sm mt-1">{saveError}</p>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        الاسم الكامل *
                                    </label>
                                    <input
                                        type="text"
                                        value={editedData.fullName || ''}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        placeholder="أدخل الاسم الكامل"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        رقم الهاتف *
                                    </label>
                                    <input
                                        type="tel"
                                        value={editedData.phoneNumber || ''}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        placeholder="أدخل رقم الهاتف"
                                        required
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        نبذة عني
                                    </label>
                                    <textarea
                                        value={editedData.bio || ''}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        className="w-full min-h-[80px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        placeholder="أدخل نبذة عنك..."
                                    />
                                </div>

                                {/* Academic Information */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <Icon icon="mdi:school" className="text-orange-500" />
                                        المعلومات الأكاديمية
                                    </h3>

                                    {/* Academic Title */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            المسمى الوظيفي *
                                        </label>
                                        <input
                                            type="text"
                                            value={editedData.academicInfo?.academicTitle || ''}
                                            onChange={(e) => handleAcademicInfoChange('academicTitle', e.target.value)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            placeholder="أدخل المسمى الوظيفي"
                                            required
                                        />
                                    </div>

                                    {/* Academic Degree */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            الدرجة العلمية *
                                        </label>
                                        <input
                                            type="text"
                                            value={editedData.academicInfo?.academicDegree || ''}
                                            onChange={(e) => handleAcademicInfoChange('academicDegree', e.target.value)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            placeholder="أدخل الدرجة العلمية"
                                            required
                                        />
                                    </div>

                                    {/* Years of Experience */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            سنوات الخبرة *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={editedData.academicInfo?.yearsOfExperience || ''}
                                            onChange={(e) => handleAcademicInfoChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            placeholder="أدخل عدد سنوات الخبرة"
                                            required
                                        />
                                    </div>

                                    {/* Specializations */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            التخصصات *
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {allSpecializations.map((spec) => (
                                                <button
                                                    key={spec.id}
                                                    type="button"
                                                    onClick={() => handleSpecializationToggle(spec.value)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedSpecializations.includes(spec.value) ? spec.bgColor + ' ' + spec.color : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                                >
                                                    {spec.name}
                                                    {selectedSpecializations.includes(spec.value) && ' ✓'}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            انقر على التخصصات لاختيارها
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
                            <button
                                onClick={handleCloseEditModal}
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:border-red-500 text-gray-700 dark:text-gray-300 hover:text-red-600 rounded-lg font-medium transition-colors"
                                disabled={isSaving}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving || !editedData.fullName || !editedData.phoneNumber || !editedData.academicInfo?.academicTitle || !editedData.academicInfo?.academicDegree || selectedSpecializations.length === 0}
                                className="px-6 py-3 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="mdi:content-save" className="text-sm" />
                                        حفظ التعديلات
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDoctor;