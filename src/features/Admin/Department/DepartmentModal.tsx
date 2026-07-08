// src/features/Admin/DepartmentsAdmin/DepartmentModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Department, DepartmentFormData } from '../AdminTypes/Department.interface';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DepartmentFormData) => Promise<void>;
    editingDepartment: Department | null;
    loading: boolean;
    universities: any[];
    doctors: any[];
    selectedUniversityId: string;
    onUniversityChange: (universityId: string) => void;
    fetchingDoctors: boolean;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingDepartment,
    loading,
    universities,
    doctors,
    selectedUniversityId,
    onUniversityChange,
    fetchingDoctors,
}) => {
    const [formData, setFormData] = useState<DepartmentFormData>({
        departmentName: '',
        universityId: '',
        headDoctorId: '',
    });

    const [errors, setErrors] = useState({
        departmentName: '',
        universityId: '',
        headDoctorId: '',
    });

    // تعيين البيانات الأولية عند فتح المودال فقط
    useEffect(() => {
        if (isOpen) {
            if (editingDepartment) {
                setFormData({
                    departmentName: editingDepartment.departmentName,
                    universityId: editingDepartment.universityId,
                    headDoctorId: editingDepartment.headDoctorId,
                });
                onUniversityChange(editingDepartment.universityId);
            } else {
                setFormData({
                    departmentName: '',
                    universityId: '',
                    headDoctorId: '',
                });
                setErrors({
                    departmentName: '',
                    universityId: '',
                    headDoctorId: '',
                });
            }
        }
    }, [isOpen]); // ✅ خلي الاعتماد على isOpen بس، مش editingDepartment

    // تحديث formData عند تغيير الحقول
    const handleDepartmentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('✏️ Department name changed:', e.target.value);
        setFormData(prev => ({ ...prev, departmentName: e.target.value }));
        setErrors(prev => ({ ...prev, departmentName: '' }));
    };

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uniId = e.target.value;
        console.log('🏫 University changed:', uniId);
        setFormData(prev => ({ ...prev, universityId: uniId, headDoctorId: '' }));
        setErrors(prev => ({ ...prev, universityId: '', headDoctorId: '' }));
        onUniversityChange(uniId);
    };

    const handleHeadDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const doctorId = e.target.value;
        console.log('👨‍⚕️ Head doctor changed:', doctorId);
        setFormData(prev => ({ ...prev, headDoctorId: doctorId }));
        setErrors(prev => ({ ...prev, headDoctorId: '' }));
    };

    // التحقق من صحة البيانات
    const validateForm = (): boolean => {
        const newErrors = {
            departmentName: '',
            universityId: '',
            headDoctorId: '',
        };
        let isValid = true;

        if (!formData.departmentName.trim()) {
            newErrors.departmentName = 'اسم القسم مطلوب';
            isValid = false;
        }

        if (!formData.universityId) {
            newErrors.universityId = 'الجامعة مطلوبة';
            isValid = false;
        }

        if (!formData.headDoctorId) {
            newErrors.headDoctorId = 'رئيس القسم مطلوب';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('📦 Form data before submit:', formData);
        
        if (!validateForm()) {
            console.log('❌ Validation failed');
            return;
        }
        
        console.log('✅ Submitting form data:', formData);
        await onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl animate-slideUp">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {editingDepartment ? 'تعديل قسم' : 'إضافة قسم جديد'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        disabled={loading}
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* اسم القسم */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            اسم القسم <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.departmentName}
                            onChange={handleDepartmentNameChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.departmentName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                            placeholder="مثال: قسم علوم الحاسب"
                            disabled={loading}
                        />
                        {errors.departmentName && (
                            <p className="text-xs text-red-500 mt-1">{errors.departmentName}</p>
                        )}
                    </div>

                    {/* اختيار الجامعة */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الجامعة <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.universityId}
                            onChange={handleUniversityChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.universityId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                            disabled={loading}
                        >
                            <option value="">اختر الجامعة</option>
                            {universities.map((uni) => (
                                <option key={uni._id || uni.id} value={uni._id || uni.id}>
                                    {uni.universityName || uni.name}
                                </option>
                            ))}
                        </select>
                        {errors.universityId && (
                            <p className="text-xs text-red-500 mt-1">{errors.universityId}</p>
                        )}
                    </div>

                    {/* اختيار رئيس القسم */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            رئيس القسم <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.headDoctorId}
                            onChange={handleHeadDoctorChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.headDoctorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                            disabled={loading || !formData.universityId || fetchingDoctors}
                        >
                            <option value="">
                                {!formData.universityId 
                                    ? 'اختر الجامعة أولاً' 
                                    : fetchingDoctors 
                                        ? 'جاري تحميل الدكاترة...' 
                                        : doctors.length === 0 
                                            ? 'لا يوجد دكاترة في هذه الجامعة'
                                            : 'اختر رئيس القسم'}
                            </option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                                    {doctor.fullName || doctor.name} 
                                    {doctor.email ? ` (${doctor.email})` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.headDoctorId && (
                            <p className="text-xs text-red-500 mt-1">{errors.headDoctorId}</p>
                        )}
                        {formData.universityId && doctors.length === 0 && !fetchingDoctors && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">warning</span>
                                لا يوجد دكاترة مسجلين في هذه الجامعة. قم بإضافة دكاترة أولاً.
                            </p>
                        )}
                    </div> */}

                    {/* عرض البيانات الحالية (للتأكد) */}
                    <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                        <p>📋 البيانات الحالية:</p>
                        <p>القسم: {formData.departmentName || '(فارغ)'}</p>
                        <p>الجامعة ID: {formData.universityId || '(فارغ)'}</p>
                        <p>رئيس القسم ID: {formData.headDoctorId || '(فارغ)'}</p>
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || fetchingDoctors}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {editingDepartment ? (loading ? 'جاري التحديث...' : 'تحديث') : (loading ? 'جاري الإضافة...' : 'إضافة')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};