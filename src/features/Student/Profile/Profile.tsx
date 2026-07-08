import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, BookOpen, Building, Hash, Briefcase, Code, CheckCircle } from 'lucide-react';
import type { ApiStudentProfileResponse, InfoItemProps, UpdateProfileDto } from '../types/profile.interface';
import { getProfile, updateProfile } from '../services/userService';
import { toast, ToastContainer } from 'react-toastify';
import Loading from '../../../components/loading/loading';

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, color, bgColor }) => {
    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${bgColor}`}>
                <div className={color}> {icon} </div>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1"> {label} </p>
                <p className="font-medium text-gray-800"> {value} </p>
            </div>
        </div>
    );
};

const StudentProfile: React.FC = () => {
    const [studentData, setStudentData] = useState<ApiStudentProfileResponse | null>(null);
    const [formData, setFormData] = useState<UpdateProfileDto>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // دالة لتحميل البيانات
    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setStudentData(data);

            // تحضير البيانات للفورم بشكل كامل
            if (data && data.data) {
                setFormData({
                    fullName: data.data.fullName,
                    phoneNumber: data.data.phoneNumber || '',
                    bio: data.data.bio || '',
                    profileImage: data.data.profileImage || '',

                });
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            alert("فشل في تحميل البيانات");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            profileImage: file, // File حقيقي
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("📤 Sending data to API:");

            // تنظيف البيانات - إزالة الحقول الفارغة
            const cleanedData: UpdateProfileDto = {};

            // نسخ فقط الحقول اللي ليها قيمة
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    cleanedData[key as keyof UpdateProfileDto] = value;
                }
            });

            console.log("Cleaned data:", cleanedData);
            console.log("Full formData:", formData);

            // إرسال البيانات
            const res = await updateProfile(cleanedData);
            console.log("✅ Response from API:", res);

            // إعادة تحميل البيانات
            await loadProfile();

            setIsModalOpen(false);
            toast.success("تم التحديث بنجاح")

        } catch (error: any) {
            console.error("❌ Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            let errorMessage = "حصل خطأ أثناء التعديل";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // لو في validation errors
                const errors = error.response.data.errors;
                errorMessage = Object.values(errors).flat().join(', ');
            }

            toast.error(errorMessage)
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        return () => {
            if (formData.profileImage && typeof formData.profileImage !== 'string') {
                URL.revokeObjectURL(formData.profileImage as any);
            }
        };
    }, [formData.profileImage]);

    const openModal = () => {
        // تأكد من وجود البيانات قبل فتح المودال
        if (studentData && studentData.data) {
            setFormData({
                fullName: studentData.data.fullName,
                phoneNumber: studentData.data.phoneNumber || '',
                bio: studentData.data.bio || '',
                profileImage: studentData.data.profileImage || '',

            });
        }
        console.log("setFormData", studentData);

        setIsModalOpen(true);
    };

    if (!studentData) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 font-sans">
            <ToastContainer position="top-left" rtl={true} />

            <div className="max-w-6xl mx-auto">
                {/* العنوان الرئيسي */}
                <div className="mb-8 text-right">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800"> ملف الطالب الشخصي </h1>
                    <h2 className="text-gray-600 mt-2 text-4xl"> {studentData.data.universityId.universityName} </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* الشريط الجانبي */}
                    <div className="lg:w-1/3">
                        {/* بطاقة الطالب */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white mb-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 bg-white/20 overflow-hidden rounded-full flex items-center justify-center mb-4 border-4 border-white/30">
                                    <img
                                        src={studentData.data.profileImage}
                                        alt="Profile"
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold mb-1"> {studentData.data.fullName} </h2>
                                <p className="text-blue-100 mb-3"> {studentData.data.departmentId.departmentName} </p>

                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm"> {studentData.data.universityId.universityName} </span>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white/20 rounded-full p-2">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1"> مقروءة </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white/20 rounded-full p-2">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs mt-1"> تحليل الملف </span>
                                    </div>
                                </div>
                                <button
                                    onClick={openModal}
                                    className="mt-4 bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-full transition"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "جاري التحميل..." : "تعديل البيانات"}
                                </button>
                            </div>
                        </div>

                        {/* حالة الطلب */}
                        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800"> حالة الطلب </h3>
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium"> مساعد موافق </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-gray-700"> {studentData.data.departmentId.departmentName} </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-gray-700"> السنة الرابعة </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                                    <span className="text-gray-700"> الجامعة : {studentData.data.universityId.universityName} </span>
                                </div>
                            </div>
                        </div>

                        {/* المهارات */}
                        <div className="bg-white rounded-2xl shadow-lg p-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-4"> المهارات التقنية </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"> Full Stack </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"> React </span>
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"> Node.js </span>
                            </div>
                        </div>
                    </div>

                    {/* المحتوى الرئيسي */}
                    <div className="lg:w-2/3">
                        {/* المعلومات الشخصية */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800"> المعلومات الشخصية </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-4">
                                    <InfoItem
                                        icon={<User className="w-5 h-5" />}
                                        label="الاسم الكامل"
                                        value={studentData.data.fullName}
                                        color="text-blue-600"
                                        bgColor="bg-blue-50"
                                    />
                                    <InfoItem
                                        icon={<Mail className="w-5 h-5" />}
                                        label="البريد الإلكتروني"
                                        value={studentData.data.email}
                                        color="text-red-600"
                                        bgColor="bg-red-50"
                                    />
                                    <InfoItem
                                        icon={<Phone className="w-5 h-5" />}
                                        label="رقم الهاتف"
                                        value={studentData.data.phoneNumber}
                                        color="text-green-600"
                                        bgColor="bg-green-50"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <InfoItem
                                        icon={<BookOpen className="w-5 h-5" />}
                                        label="التخصص"
                                        value={studentData.data.departmentId.departmentName}
                                        color="text-purple-600"
                                        bgColor="bg-purple-50"
                                    />
                                    <InfoItem
                                        icon={<Building className="w-5 h-5" />}
                                        label="الجامعة"
                                        value={studentData.data.universityId.universityName}
                                        color="text-amber-600"
                                        bgColor="bg-amber-50"
                                    />
                                    <InfoItem
                                        icon={<Hash className="w-5 h-5" />}
                                        label="الرقم الجامعي"
                                        value={studentData.data.universityCode}
                                        color="text-indigo-600"
                                        bgColor="bg-indigo-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* نبذة عني */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800"> نبذة عني </h2>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <p className="text-gray-700 leading-relaxed text-right">
                                    {studentData.data.bio || "لا توجد نبذة حالياً"}
                                </p>
                            </div>
                        </div>

                        {/* المشروع الحالي */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Code className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800"> المشروع الحالي </h2>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-2"> ملف الطالب الشخصي </h3>
                                <p className="text-gray-700 leading-relaxed text-right">
                                    {studentData.data.bio || "لا توجد معلومات عن المشروع الحالي"}
                                </p>

                                <div className="mt-4 pt-4 border-t border-emerald-200">
                                    <h4 className="font-bold text-gray-700 mb-2"> تقنيات المشروع: </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"> تطوير واجهة المستخدم </span>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"> إدارة قواعد البيانات </span>
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"> تتبع المخزون </span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"> واجهات برمجية(API) </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* تذييل الصفحة */}
                <div className="mt-8 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
                    <p>{studentData.data.universityId.universityName} - نظام إدارة ملفات الطلاب © {new Date().getFullYear()} </p>
                    <p className="mt-1"> جميع الحقوق محفوظة </p>
                </div>
            </div>

            {/* المودال */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isLoading}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold mb-4">تعديل البيانات</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* الاسم بالكامل */}
                            <div>
                                <label htmlFor='fullName' className="block text-sm font-medium text-gray-700 mb-1">
                                    الاسم بالكامل
                                </label>
                                <input id='fullName'
                                    name="fullName"
                                    value={formData.fullName || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* رقم الهاتف */}
                            <div>
                                <label htmlFor='phone' className="block text-sm font-medium text-gray-700 mb-1">
                                    رقم الهاتف
                                </label>
                                <input id='phone'
                                    name="phoneNumber"
                                    value={formData.phoneNumber || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                            {/* صورة الملف الشخصي */}
                            <div>
                                <label htmlFor='file' className="block text-sm font-medium text-gray-700 mb-1">
                                    رابط الصورة الشخصية
                                </label>
                                <input id='file'
                                    type='file'
                                    name="profileImage"

                                    onChange={handleFileChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={isLoading}
                                />
                                {formData.profileImage && typeof formData.profileImage !== 'string' && (
                                    <img
                                        src={URL.createObjectURL(formData.profileImage)}
                                        alt="preview"
                                        className="w-24 h-24 rounded-full object-cover mt-2"
                                    />
                                )}
                            </div>

                            {/* النبذة */}
                            <div>
                                <label htmlFor='bio' className="block text-sm font-medium text-gray-700 mb-1">
                                    نبذة عنك
                                </label>
                                <textarea id='bio'
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري الحفظ...
                                        </span>
                                    ) : "حفظ التعديلات"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;