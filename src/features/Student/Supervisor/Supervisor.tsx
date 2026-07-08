// src/features/Doctor/Supervisor/SupervisionRequest.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { ApiSupervisionRequest, Department, Doctor, FormData, TeamMemberUI } from '../types/Supervisor.interface';
import { getDepartments, getDoctorsByDepartment } from '../services/Supervisor';
import TeamMembersForm from './TeamMembersForm';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../contexts/language.context';
import Loading from '../../../components/loading/loading';

const SupervisionRequest: React.FC = () => {
    const currentYear = new Date().getFullYear().toString();

    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
    const [technologies, setTechnologies] = useState<string[]>(['React']);
    const [techInput, setTechInput] = useState<string>('');
    const [teamMembers, setTeamMembers] = useState<TeamMemberUI[]>([
        { id: Date.now(), name: '', studentId: '', role: '', email: '', isLeader: false }
    ]);
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        projectType: '',
        projectDescription: '',
        projectGoals: '',
        prerequisites: '',
        additionalNotes: '',
        year: currentYear
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(false);
    const { t, i18n } = useTranslation();
    const { lang } = useLanguage();

    useEffect(() => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    // ✅ جلب الأقسام عند تحميل الصفحة
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setIsLoading(true);
                const departmentsData = await getDepartments();
                setDepartments(departmentsData);
                console.log('✅ Departments loaded:', departmentsData);
            } catch (error) {
                console.error('Error fetching departments:', error);
                toast.error('فشل في تحميل الأقسام');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    // ✅ جلب الدكاترة عند اختيار القسم - بدون Reload
    const fetchDoctors = useCallback(async () => {
        if (!selectedDepartment) {
            setDoctors([]);
            setSelectedSupervisor('');
            return;
        }

        try {
            setIsLoadingDoctors(true);
            const doctorsData = await getDoctorsByDepartment(selectedDepartment);
            console.log(`✅ Doctors loaded for department:`, doctorsData);
            setDoctors(doctorsData);
            setSelectedSupervisor('');
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('فشل في تحميل الدكاترة');
            setDoctors([]);
        } finally {
            setIsLoadingDoctors(false);
        }
    }, [selectedDepartment]);

    // ✅ استدعاء fetchDoctors عند تغيير القسم
    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // ✅ الدكاترة المعروضة
    const displayDoctors = selectedDepartment ? doctors : [];

    // ✅ إضافة تقنية
    const addTechnology = (): void => {
        const tech = techInput.trim();
        if (tech && !technologies.includes(tech)) {
            setTechnologies([...technologies, tech]);
            setTechInput('');
        }
    };

    // ✅ إزالة تقنية
    const removeTechnology = (tech: string): void => {
        setTechnologies(technologies.filter(t => t !== tech));
    };

    // ✅ تحديث بيانات النموذج
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ✅ معالجة إدخال التقنية عند الضغط على Enter
    const handleTechInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnology();
        }
    };

    // ✅ تحضير البيانات للإرسال للـ API
    const prepareDataForApi = (): ApiSupervisionRequest => {
        return {
            doctorId: selectedSupervisor,
            departmentId: selectedDepartment,
            project_name: formData.projectName,
            project_type: formData.projectType,
            project_description: formData.projectDescription,
            main_objectives: formData.projectGoals,
            prerequisites: formData.prerequisites || undefined,
            additional_notes: formData.additionalNotes || undefined,
            technologies,
            year: formData.year,
            team_members: teamMembers.map(member => ({
                full_name: member.name,
                university_number: member.studentId,
                role: member.role,
                contact_email: member.email,
                isLeader: member.isLeader
            }))
        };
    };

    // ✅ التحقق من صحة البيانات
    const validateForm = (): boolean => {
        if (!selectedDepartment) {
            toast.error('الرجاء اختيار القسم');
            return false;
        }

        if (!selectedSupervisor) {
            toast.error('الرجاء اختيار الدكتور المشرف');
            return false;
        }

        if (!formData.projectName.trim()) {
            toast.error('الرجاء إدخال اسم المشروع');
            return false;
        }

        if (!formData.projectType) {
            toast.error('الرجاء اختيار نوع المشروع');
            return false;
        }

        if (!formData.projectDescription.trim()) {
            toast.error('الرجاء إدخال وصف المشروع');
            return false;
        }

        if (!formData.projectGoals.trim()) {
            toast.error('الرجاء إدخال أهداف المشروع');
            return false;
        }

        if (!formData.year.trim()) {
            toast.error('الرجاء إدخال السنة الدراسية');
            return false;
        }

        if (teamMembers.length === 0) {
            toast.error('الرجاء إضافة عضو فريق واحد على الأقل');
            return false;
        }

        for (const member of teamMembers) {
            if (!member.name.trim()) {
                toast.error('الرجاء إدخال اسم عضو الفريق');
                return false;
            }
            if (!member.studentId.trim()) {
                toast.error('الرجاء إدخال الرقم الجامعي');
                return false;
            }
            if (!member.role.trim()) {
                toast.error('الرجاء إدخال دور عضو الفريق');
                return false;
            }
            if (!member.email.trim()) {
                toast.error('الرجاء إدخال البريد الإلكتروني');
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(member.email)) {
                toast.error('الرجاء إدخال بريد إلكتروني صحيح');
                return false;
            }
        }

        return true;
    };

    // ✅ إرسال النموذج إلى الـ API
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const requestData = prepareDataForApi();
            const token = localStorage.getItem('accessToken');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            console.log('📤 Sending request data:', requestData);
            const API_BASE_URL = 'http://localhost:3000/api/v1';

            const response = await axios.post(
                `${API_BASE_URL}/supervision-requests`,
                requestData,
                { headers }
            );

            console.log('✅ API Response:', response.data);

            const requestId = response.data.data?._id || response.data.id || response.data.requestId;
            toast.success(`تم إرسال طلب الإشراف بنجاح! رقم الطلب: ${requestId}`);

            resetForm();

        } catch (error: any) {
            console.error('❌ Error submitting form:', error);

            if (error.response) {
                console.error('Response error details:', error.response.data);
                const errorMessage = error.response.data?.message || 'حدث خطأ أثناء إرسال الطلب';

                if (Array.isArray(errorMessage)) {
                    errorMessage.forEach((msg: string) => {
                        toast.error(msg);
                    });
                } else {
                    toast.error(errorMessage);
                }
            } else if (error.request) {
                toast.error('تعذر الاتصال بالخادم. الرجاء المحاولة لاحقاً.');
            } else {
                toast.error('حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ إعادة تعيين النموذج
    const resetForm = (): void => {
        setSelectedDepartment('');
        setSelectedSupervisor('');
        setTechnologies(['React']);
        setTeamMembers([{ id: Date.now(), name: '', studentId: '', role: '', email: '', isLeader: false }]);
        setFormData({
            projectName: '',
            projectType: '',
            projectDescription: '',
            projectGoals: '',
            prerequisites: '',
            additionalNotes: '',
            year: currentYear
        });
        setTechInput('');
    };

    // ✅ الحفظ كمسودة
    const saveAsDraft = (): void => {
        const draftData = prepareDataForApi();
        localStorage.setItem('supervisionRequestDraft', JSON.stringify(draftData));
        toast.info('تم حفظ الطلب كمسودة!');
    };

    // ✅ تحميل المسودة المحفوظة
    const loadDraft = (): void => {
        const savedDraft = localStorage.getItem('supervisionRequestDraft');
        if (savedDraft) {
            try {
                const draft: ApiSupervisionRequest = JSON.parse(savedDraft);

                setSelectedSupervisor(draft.doctorId);
                setSelectedDepartment(draft.departmentId);
                setTechnologies(draft.technologies);
                setFormData({
                    projectName: draft.project_name,
                    projectType: draft.project_type,
                    projectDescription: draft.project_description,
                    projectGoals: draft.main_objectives,
                    prerequisites: draft.prerequisites || '',
                    additionalNotes: draft.additional_notes || '',
                    year: draft.year
                });

                const loadedTeamMembers: TeamMemberUI[] = draft.team_members?.map((member, index) => ({
                    id: Date.now() + index,
                    name: member.full_name,
                    studentId: member.university_number,
                    role: member.role,
                    email: member.contact_email,
                    isLeader: member.isLeader
                }));
                setTeamMembers(loadedTeamMembers);

                toast.success('تم تحميل المسودة بنجاح!');
            } catch (error) {
                console.error('Error loading draft:', error);
                toast.error('حدث خطأ أثناء تحميل المسودة');
            }
        } else {
            toast.info('لا توجد مسودة محفوظة');
        }
    };

    // ✅ الحصول على الدكتور المختار
    const selectedDoctor = doctors.find(doctor => doctor._id === selectedSupervisor);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <ToastContainer position="top-left" rtl={true} />

            <div className="mx-auto max-w-4xl p-4">
                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6 shadow-lg">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black leading-tight mb-2">{t("طلب إشراف أكاديمي")}</h1>
                            <p className="text-white/80 text-sm">املأ النموذج لإرسال طلب إشراف للدكتور الذي تريده</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 self-start">
                            <div className="size-3 rounded-full bg-yellow-400 animate-pulse"></div>
                            <p className="text-white font-medium text-sm">طلب جديد</p>
                        </div>

                        <button
                            type="button"
                            onClick={loadDraft}
                            className="self-start bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            تحميل المسودة المحفوظة
                        </button>
                    </div>
                </div>

                {/* Request Form */}
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* اختيار القسم */}
                        <div>
                            <label htmlFor="shoseDepart" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اختر القسم *
                            </label>
                            <select
                                id="shoseDepart"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={selectedDepartment}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setSelectedDepartment(e.target.value);
                                    setSelectedSupervisor('');
                                }}
                                required
                                disabled={isLoadingDoctors}
                            >
                                <option value="">-- اختر القسم --</option>
                                {departments.map((department) => (
                                    <option key={department._id} value={department._id}>
                                        {department.departmentName}
                                        {department.universityId?.universityName && ` – ${department.universityId.universityName}`}
                                    </option>
                                ))}
                            </select>
                            {isLoadingDoctors && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></span>
                                    جاري تحميل الدكاترة...
                                </p>
                            )}
                        </div>

                        {/* اختيار الدكتور */}
                        <div>
                            <label htmlFor="shoesDoc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اختر الدكتور المشرف *
                            </label>
                            <select
                                id="shoesDoc"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={selectedSupervisor}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedSupervisor(e.target.value)}
                                disabled={!selectedDepartment || isLoadingDoctors}
                            >
                                <option value="">
                                    {!selectedDepartment ? 'اختر القسم أولاً' : isLoadingDoctors ? 'جاري التحميل...' : '-- اختر الدكتور --'}
                                </option>
                                {displayDoctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.fullName}
                                    </option>
                                ))}
                            </select>
                            {selectedDepartment && !isLoadingDoctors && displayDoctors.length === 0 && (
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                                    ⚠️ لا يوجد دكاترة في هذا القسم
                                </p>
                            )}
                            {selectedDepartment && !isLoadingDoctors && displayDoctors.length > 0 && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                    ✅ {displayDoctors.length} دكتور/أطباء متاحين
                                </p>
                            )}
                        </div>

                        {/* باقي محتوى الفورم */}
                        {/* السنة الدراسية */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                السنة الدراسية *
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="مثال: 2024-2025"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* معلومات المشروع */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <span className="material-symbols-outlined text-blue-600">description</span>
                                معلومات المشروع
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        اسم المشروع *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="أدخل اسم المشروع"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="kindProject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        نوع المشروع *
                                    </label>
                                    <select
                                        id="kindProject"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- اختر نوع المشروع --</option>
                                        <option value="web">تطبيق ويب</option>
                                        <option value="mobile">تطبيق جوال</option>
                                        <option value="desktop">تطبيق سطح مكتب</option>
                                        <option value="ai">ذكاء اصطناعي</option>
                                        <option value="iot">إنترنت الأشياء</option>
                                        <option value="other">أخرى</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    وصف المشروع *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
                                    placeholder="صف فكرة المشروع وأهدافه..."
                                    name="projectDescription"
                                    value={formData.projectDescription}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    الأهداف الرئيسية *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                                    placeholder="اذكر الأهداف التي تريد تحقيقها من المشروع..."
                                    name="projectGoals"
                                    value={formData.projectGoals}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    التقنيات المستخدمة
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {technologies.map((tech, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm"
                                        >
                                            <span>{tech}</span>
                                            <button
                                                type="button"
                                                className="material-symbols-outlined text-sm hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                                                onClick={() => removeTechnology(tech)}
                                                aria-label={`إزالة ${tech}`}
                                            >
                                                close
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="أضف تقنية جديدة"
                                        value={techInput}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTechInput(e.target.value)}
                                        onKeyPress={handleTechInputKeyPress}
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={addTechnology}
                                    >
                                        إضافة
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* معلومات الفريق */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <TeamMembersForm
                                teamMembers={teamMembers}
                                setTeamMembers={setTeamMembers}
                            />
                        </div>

                        {/* معلومات إضافية */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <span className="material-symbols-outlined text-blue-600">info</span>
                                معلومات إضافية
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    المتطلبات السابقة
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[80px]"
                                    placeholder="اذكر أي متطلبات أو مهارات مسبقة يحتاجها المشروع..."
                                    name="prerequisites"
                                    value={formData.prerequisites}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ملاحظات إضافية للدكتور
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                                    placeholder="أي ملاحظات إضافية تريد إضافتها للدكتور..."
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* أزرار الإرسال */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        إرسال طلب الإشراف
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-2"
                                onClick={saveAsDraft}
                            >
                                حفظ كمسودة
                            </button>
                        </div>
                    </form>
                </div>

                {/* معلومات الدكتور المختار */}
                {selectedDoctor && (
                    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md mt-6">
                        <div className="flex items-start gap-4">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 border-2 border-blue-500/30 flex-shrink-0"
                                style={{ backgroundImage: `url('${selectedDoctor.profileImage || ''}')` }}
                                role="img"
                                aria-label={`صورة ${selectedDoctor.fullName}`}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {selectedDoctor.fullName}
                                    </h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    {departments.find(d => d._id === selectedDepartment)?.departmentName || 'القسم'}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">mail</span>
                                        {selectedDoctor.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SupervisionRequest;