// src/features/Admin/UnvirstyAdmin/UniversityModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { University, UniversityFormData } from '../AdminTypes/Universty.interface';

interface UniversityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UniversityFormData) => Promise<void>;
    editingUniversity: University | null;
    loading: boolean;
}

export const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, onClose, onSubmit, editingUniversity, loading }) => {
    const [formData, setFormData] = useState<UniversityFormData>({ universityName: '', location: '', contactEmail: '' });

    useEffect(() => {
        if (editingUniversity) {
            setFormData({
                universityName: editingUniversity.name,
                location: editingUniversity.location,
                contactEmail: editingUniversity.email,
            });
        } else {
            setFormData({ universityName: '', location: '', contactEmail: '' });
        }
    }, [editingUniversity, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h3 className="text-xl font-bold">{editingUniversity ? 'تعديل جامعة' : 'إضافة جامعة جديدة'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg" disabled={loading}>
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" required placeholder="اسم الجامعة" value={formData.universityName} onChange={(e) => setFormData({ ...formData, universityName: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" disabled={loading} />
                    <input type="text" required placeholder="الموقع" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" disabled={loading} />
                    <input type="email" required placeholder="البريد الإلكتروني" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" disabled={loading} />
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {editingUniversity ? 'تحديث' : 'إضافة'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-200 dark:bg-gray-800 py-2 rounded-lg font-semibold">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};