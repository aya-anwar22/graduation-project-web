// components/EditProjectModal.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import type { ProjectData } from '../types/myProject.interface';
import ProjectUpdateService from '../services/ProjectUpdateService'; // تحقق من اسم الملف

interface EditProjectModalProps {
    project: ProjectData;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
    project,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        description: project.projectDescription || '',
        projectType: project.projectType || 'web',
        projectLink: project.projectLink || '',
        mainObjective: project.projectMainObjectives || '',
        technologies: project.technologies || []
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(project.projectImage);
    const [newTechnology, setNewTechnology] = useState<string>('');
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // أنواع المشاريع المتاحة
    const projectTypes = [
        { value: 'web', label: 'تطبيق ويب' },
        { value: 'mobile', label: 'تطبيق جوال' },
        { value: 'desktop', label: 'تطبيق سطح مكتب' },
        { value: 'ai', label: 'ذكاء اصطناعي' },
        { value: 'iot', label: 'إنترنت الأشياء' },
        { value: 'game', label: 'لعبة' },
        { value: 'other', label: 'أخرى' }
    ];

    // إعادة تعيين البيانات عند فتح الـ Modal
    useEffect(() => {
        if (isOpen && project) {
            setFormData({
                description: project.projectDescription || '',
                projectType: project.projectType || 'web',
                projectLink: project.projectLink || '',
                mainObjective: project.projectMainObjectives || '',
                technologies: project.technologies || []
            });
            setImagePreview(project.projectImage);
            setImage(null);
            setNewTechnology('');
            setError(null);
            setSuccess(null);
        }
    }, [isOpen, project]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // التحقق من صحة الصورة
            const validation = ProjectUpdateService.validateImage(file);
            if (!validation.isValid) {
                setError(validation.message || 'الصورة غير صالحة');
                return;
            }

            setImage(file);

            // إنشاء معاينة للصورة
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTechnology();
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // التحقق من رابط المشروع
        if (formData.projectLink && formData.projectLink.trim() !== '') {
            const linkValidation = ProjectUpdateService.validateProjectLink(formData.projectLink);
            if (!linkValidation.isValid) {
                setError(linkValidation.message || 'الرابط غير صالح');
                return;
            }
        }

        setUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await ProjectUpdateService.updateProject({
                ...formData,
                image: image || undefined,
                projectId: project.projectId
            });
            console.log("resultUpdate", result);

            if (result.success) {
                setSuccess('تم تحديث المشروع بنجاح!');

                // إعادة تحميل البيانات بعد تأخير
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setTimeout(() => {
                        setSuccess(null);
                    }, 2000);
                }, 1500);
            } else {
                setError(result.message || 'فشل في تحديث المشروع');
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير متوقع');
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto ">
            <div className="flex items-center   justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* الخلفية */}
                {/* <div 
                    className="fixed inset-0 transition-opacity   backdrop-blur-sm" 
                    onClick={onClose}
                ></div> */}

                {/* Modal */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                <div className="inline-block align-bottom text-white bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between ">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                                        edit
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        تعديل المشروع
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {project.projectTitle}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                                    close
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 text-right">
                        {/* رسائل النجاح والخطأ */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <span className="material-symbols-outlined text-sm">error</span>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <p className="text-sm">{success}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* صورة المشروع */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    صورة المشروع :
                                </label>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="معاينة الصورة"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://via.placeholder.com/300x300?text=صورة+المشروع';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-3xl">
                                                        image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {image && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImage(null);
                                                    setImagePreview(project.projectImage);
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    close
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="updateImage">اختر الصورة :  </label>
                                        <input
                                            id='updateImage'
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={updating}
                                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            الصيغ المدعومة: JPG, PNG, GIF, WebP, SVG (الحد الأقصى 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* نوع المشروع */}
                            <div>
                                <label htmlFor='projectType' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    نوع المشروع :
                                </label>
                                <select
                                    id='projectType'
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                    disabled={updating}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {projectTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* رابط المشروع */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    رابط المشروع (اختياري) :
                                </label>
                                <input
                                    type="url"
                                    name="projectLink"
                                    value={formData.projectLink}
                                    onChange={handleInputChange}
                                    disabled={updating}
                                    placeholder="https://example.com"
                                    className="w-full p-3 rounded-xl text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* الهدف الرئيسي */}
                            <div>
                                <label htmlFor='golProject' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    الهدف الرئيسي للمشروع :
                                </label>
                                <textarea
                                    id='golProject'
                                    name="mainObjective"
                                    value={formData.mainObjective}
                                    onChange={handleInputChange}
                                    disabled={updating}
                                    rows={3}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                />
                            </div>

                            {/* وصف المشروع */}
                            <div>
                                <label htmlFor='descProject' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    وصف المشروع :
                                </label>
                                <textarea
                                    id='descProject'
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={updating}
                                    rows={4}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                />
                            </div>

                            {/* التقنيات */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    التقنيات المستخدمة :
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTechnology}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTechnology(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            disabled={updating}
                                            placeholder="أضف تقنية جديدة..."
                                            className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTechnology}
                                            disabled={updating || !newTechnology.trim()}
                                            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            إضافة
                                        </button>
                                    </div>

                                    {formData.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                                            {formData.technologies.map((tech, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600"
                                                >
                                                    <span className="text-gray-800 dark:text-gray-300">{tech}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTechnology(tech)}
                                                        disabled={updating}
                                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">
                                                            close
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {updating ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">sync</span>
                                            جاري التحديث...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">save</span>
                                            حفظ التغييرات
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={updating}
                                    className="px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProjectModal;