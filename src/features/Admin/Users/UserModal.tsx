// src/components/admin/UserModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    editingUser: any | null;
    loading: boolean;
    universities: any[];
    departments: any[];
    onUniversityChange?: (universityId: string) => void;
    fetchingDepartments?: boolean;
}

export const UserModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    editingUser,
    loading,
    universities,
    departments,
    onUniversityChange,
    fetchingDepartments = false,
}) => {
    const [formData, setFormData] = useState<any>({
        fullName: '',
        email: '',
        role: 'student',
        password: '',
        phoneNumber: '',
        universityId: '',
        departmentId: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        role: '',
        universityId: '',
        departmentId: '',
        password: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (editingUser) {
            setFormData({
                fullName: editingUser.fullName || editingUser.name || '',
                email: editingUser.email || '',
                role: editingUser.role || 'student',
                phoneNumber: editingUser.phoneNumber || editingUser.phone || '',
                universityId: editingUser.universityId || '',
                departmentId: editingUser.departmentId || '',
                password: '',
            });
        } else {
            setFormData({
                fullName: '',
                email: '',
                role: 'student',
                password: '',
                phoneNumber: '',
                universityId: '',
                departmentId: '',
            });
        }
    }, [editingUser, isOpen]);

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uniId = e.target.value;
        setFormData((prev: any) => ({ ...prev, universityId: uniId, departmentId: '' }));
        if (onUniversityChange) {
            onUniversityChange(uniId);
        }
        setErrors(prev => ({ ...prev, universityId: '', departmentId: '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        setErrors((prev: any) => ({ ...prev, [name]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors = {
            fullName: '',
            email: '',
            role: '',
            universityId: '',
            departmentId: '',
            password: '',
            phoneNumber: '',
        };
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'الاسم مطلوب';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'البريد الإلكتروني مطلوب';
            isValid = false;
        }
        if (!formData.universityId) {
            newErrors.universityId = 'الجامعة مطلوبة';
            isValid = false;
        }
        if (!formData.departmentId) {
            newErrors.departmentId = 'القسم مطلوب';
            isValid = false;
        }
        if (!editingUser && !formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const submitData = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phoneNumber: formData.phoneNumber,
            universityId: formData.universityId,
            departmentId: formData.departmentId,
        };
        
        console.log('📤 Submitting user data:', submitData);
        await onSubmit(submitData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl animate-slideUp">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
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
                    {/* الاسم الكامل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                            placeholder="مثال: د. أحمد محمد"
                            disabled={loading}
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            البريد الإلكتروني <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                            placeholder="example@domain.com"
                            disabled={loading}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* كلمة المرور */}
                    {!editingUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                كلمة المرور <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                                placeholder="أدخل كلمة المرور"
                                disabled={loading}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                    )}

                    {/* الدور */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الدور <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            disabled={loading}
                        >
                            <option value="student">طالب</option>
                            <option value="doctor">دكتور</option>
                            <option value="admin">مسؤول</option>
                        </select>
                    </div>

                    {/* الجامعة */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الجامعة <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="universityId"
                            required
                            value={formData.universityId}
                            onChange={handleUniversityChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.universityId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                            disabled={loading}
                        >
                            <option value="">اختر الجامعة</option>
                            {universities.map((uni) => (
                                <option key={uni._id || uni.id} value={uni._id || uni.id}>
                                    {uni.universityName || uni.name}
                                </option>
                            ))}
                        </select>
                        {errors.universityId && <p className="text-xs text-red-500 mt-1">{errors.universityId}</p>}
                    </div>

                    {/* القسم */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            القسم <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="departmentId"
                            required
                            value={formData.departmentId}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.departmentId ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                            disabled={loading || !formData.universityId || fetchingDepartments}
                        >
                            <option value="">
                                {!formData.universityId 
                                    ? 'اختر الجامعة أولاً' 
                                    : fetchingDepartments 
                                        ? 'جاري تحميل الأقسام...'
                                        : departments.length === 0 
                                            ? 'لا توجد أقسام في هذه الجامعة'
                                            : 'اختر القسم'}
                            </option>
                            {departments.map((dept) => (
                                <option key={dept._id || dept.id} value={dept._id || dept.id}>
                                    {dept.departmentName || dept.name}
                                </option>
                            ))}
                        </select>
                        {errors.departmentId && <p className="text-xs text-red-500 mt-1">{errors.departmentId}</p>}
                    </div>

                    {/* رقم الهاتف */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            رقم الهاتف
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="مثال: 01234567890"
                            disabled={loading}
                        />
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {editingUser ? (loading ? 'جاري التحديث...' : 'تحديث') : (loading ? 'جاري الإضافة...' : 'إضافة')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-semibold transition"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};