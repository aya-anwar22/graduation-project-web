// src/features/Admin/UnvirstyAdmin/UnvirstyAdmin.tsx
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useUniversities } from '../../../hooks/useUniversities';
import type { University, UniversityFormData } from '../AdminTypes/Universty.interface';
import { Alert } from '../../../components/common/Alert';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { UniversityStats } from './UniversityStatus';
import { UniversityFilters } from './UniversityFilters';
import { UniversityTable } from './UniversityTable';
import { UniversityCard } from './UniversityCard';
import { UniversityModal } from './UniversityModal';

export const UniversitiesManagement: React.FC = () => {
    const { 
        universities, 
        stats, 
        loading, 
        error, 
        success, 
        addUniversity, 
        updateUniversity, 
        toggleUniversityStatus, 
        filterUniversities 
    } = useUniversities();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const filteredUniversities = useMemo(() => 
        filterUniversities(searchTerm, statusFilter), 
        [filterUniversities, searchTerm, statusFilter]
    );

    const handleAddClick = () => {
        setEditingUniversity(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (uni: University) => {
        setEditingUniversity(uni);
        setIsModalOpen(true);
    };

    const handleStatusToggleClick = (uni: University) => {
        setSelectedUniversity(uni);
        setShowStatusDialog(true);
    };

    const handleConfirmStatusToggle = async () => {
        if (selectedUniversity) {
            setIsActionLoading(true);
            await toggleUniversityStatus(selectedUniversity.id);
            setIsActionLoading(false);
            setShowStatusDialog(false);
            setSelectedUniversity(null);
        }
    };

    const handleFormSubmit = async (formData: UniversityFormData) => {
        if (editingUniversity) {
            await updateUniversity(editingUniversity.id, formData);
        } else {
            await addUniversity(formData);
        }
        setIsModalOpen(false);
    };

    const isDeleted = selectedUniversity?.status === 'deleted';
    const dialogTitle = isDeleted ? 'استعادة جامعة' : 'حذف جامعة';
    const dialogMessage = isDeleted 
        ? `هل أنت متأكد من استعادة الجامعة "${selectedUniversity?.name}"؟`
        : `هل أنت متأكد من حذف الجامعة "${selectedUniversity?.name}"؟ هذا الإجراء يمكن التراجع عنه.`;
    const confirmText = isDeleted ? 'استعادة' : 'حذف';

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            إدارة الجامعات
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            إدارة وتنظيم بيانات الجامعات
                        </p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full md:w-auto justify-center transform hover:scale-105 disabled:opacity-50"
                    >
                        <Plus className="w-5 h-5" />
                        إضافة جامعة جديدة
                    </button>
                </div>

                <UniversityStats stats={stats} />

                <UniversityFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                />

                {loading && <LoadingSpinner text="جاري تحميل البيانات..." />}

                {!loading && (
                    <>
                        <UniversityTable
                            universities={filteredUniversities}
                            onEdit={handleEditClick}
                            onStatusToggle={handleStatusToggleClick}
                            loading={loading}
                        />
                        <div className="md:hidden space-y-4">
                            {filteredUniversities.map((uni) => (
                                <UniversityCard
                                    key={uni.id}
                                    university={uni}
                                    onEdit={handleEditClick}
                                    onStatusToggle={handleStatusToggleClick}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <UniversityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                editingUniversity={editingUniversity}
                loading={loading}
            />

            <ConfirmationDialog
                isOpen={showStatusDialog}
                onClose={() => setShowStatusDialog(false)}
                onConfirm={handleConfirmStatusToggle}
                title={dialogTitle}
                message={dialogMessage}
                confirmText={confirmText}
                cancelText="إلغاء"
                isLoading={isActionLoading}
            />
        </main>
    );
};

export default UniversitiesManagement;