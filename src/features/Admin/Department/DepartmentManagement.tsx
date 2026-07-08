// src/features/Admin/DepartmentsAdmin/DepartmentsManagement.tsx
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDepartments } from '../../../hooks/useDepartments';
import type { Department, DepartmentFormData } from '../AdminTypes/Department.interface';
import { Alert } from '../../../components/common/Alert';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { DepartmentStats } from './DepartmentStats';
import { DepartmentFilters } from './DepartmentFilters';
import { DepartmentTable } from './DepartmentTable';
import { DepartmentCard } from './DepartmentCard';
import { DepartmentModal } from './DepartmentModal';

export const DepartmentsManagement: React.FC = () => {
    const {
        departments,
        universities,
        doctors,
        stats,
        loading,
        fetchingDoctors,
        error,
        success,
        selectedUniversityId,
        setSelectedUniversityId,
        addDepartment,
        updateDepartment,
        toggleDepartmentStatus,
        filterDepartments,
    } = useDepartments();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [universityFilter, setUniversityFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // فلترة الأقسام (للبحث والحالة)
    const filteredDepartments = useMemo(() => {
        return filterDepartments(searchTerm, statusFilter, universityFilter);
    }, [filterDepartments, searchTerm, statusFilter, universityFilter]);

    const handleAddClick = () => {
        setEditingDepartment(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (dept: Department) => {
        setEditingDepartment(dept);
        setSelectedUniversityId(dept.universityId);
        setIsModalOpen(true);
    };

    const handleStatusToggleClick = (dept: Department) => {
        setSelectedDepartment(dept);
        setShowStatusDialog(true);
    };

    const handleConfirmStatusToggle = async () => {
        if (selectedDepartment) {
            setIsActionLoading(true);
            await toggleDepartmentStatus(selectedDepartment.id);
            setIsActionLoading(false);
            setShowStatusDialog(false);
            setSelectedDepartment(null);
        }
    };

    const handleFormSubmit = async (formData: DepartmentFormData) => {
        if (editingDepartment) {
            await updateDepartment(editingDepartment.id, formData);
        } else {
            await addDepartment(formData);
        }
        setIsModalOpen(false);
    };

    const handleUniversityFilterChange = (value: string) => {
        setUniversityFilter(value);
        if (value) {
            setSelectedUniversityId(value);
        }
    };

    const isDeleted = selectedDepartment?.status === 'deleted';
    const dialogTitle = isDeleted ? 'استعادة قسم' : 'حذف قسم';
    const dialogMessage = isDeleted 
        ? `هل أنت متأكد من استعادة القسم "${selectedDepartment?.departmentName}"؟`
        : `هل أنت متأكد من حذف القسم "${selectedDepartment?.departmentName}"؟ هذا الإجراء يمكن التراجع عنه.`;
    const confirmText = isDeleted ? 'استعادة' : 'حذف';

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            إدارة الأقسام
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            إدارة وتنظيم الأقسام الأكاديمية
                        </p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        إضافة قسم جديد
                    </button>
                </div>

                <DepartmentStats stats={stats} />

                <DepartmentFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    universityFilter={universityFilter}
                    onUniversityFilterChange={handleUniversityFilterChange}
                    universities={universities}
                />

                {loading && <LoadingSpinner text="جاري تحميل الأقسام..." />}

                {!loading && (
                    <>
                        <DepartmentTable
                            departments={filteredDepartments}
                            onEdit={handleEditClick}
                            onStatusToggle={handleStatusToggleClick}
                            loading={loading}
                        />
                        <div className="md:hidden space-y-4">
                            {filteredDepartments.map((dept) => (
                                <DepartmentCard
                                    key={dept.id}
                                    department={dept}
                                    onEdit={handleEditClick}
                                    onStatusToggle={handleStatusToggleClick}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                editingDepartment={editingDepartment}
                loading={loading}
                universities={universities}
                doctors={doctors}
                selectedUniversityId={selectedUniversityId}
                onUniversityChange={setSelectedUniversityId}
                fetchingDoctors={fetchingDoctors}
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

export default DepartmentsManagement;