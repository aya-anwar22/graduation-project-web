// src/components/admin/UsersManagement.tsx
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import { Alert } from '../../../components/common/Alert';
import { UserStats } from './UserStats';
import { UserFilters } from './UserFilters';
import { UserCard } from './UserCard';
import { UserModal } from './UserModal';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import type { UserFilters as FiltersType } from '../AdminTypes/User.interface';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

export const UsersManagement: React.FC = () => {
    const {
        users,
        universities,
        departments,
        loading,
        statsLoading,
        stats,
        error,
        success,
        fetchingDepartments,
        addUser,
        updateUser,
        updateUserRole,
        toggleUserStatus,
        filterUsers,
        fetchDepartmentsByUniversity,
        refresh,
    } = useUsers();

    const [filters, setFilters] = useState<FiltersType>({
        search: '',
        role: 'all',
        university: 'all',
        department: 'all',
        status: 'all',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [userToToggle, setUserToToggle] = useState<{ id: string; name: string; isDeleted: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const filteredUsers = useMemo(() => filterUsers(filters), [filterUsers, filters]);

    const handleFilterChange = (key: keyof FiltersType, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // ✅ دالة تحدث الأقسام عند تغيير الجامعة
    const handleUniversityChange = async (universityId: string) => {
        await fetchDepartmentsByUniversity(universityId);
    };

    const handleAddClick = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        // عند التعديل، جلب الأقسام الخاصة بجامعة المستخدم
        if (user.universityId) {
            fetchDepartmentsByUniversity(user.universityId);
        }
        setIsModalOpen(true);
    };

    const handleViewClick = (user: any) => {
        setSelectedUserId(user._id);
        setShowDetailsModal(true);
    };

    const handleUpdateRole = async (id: string, role: string) => {
        await updateUserRole(id, role);
    };

    const handleToggleStatusClick = (id: string) => {
        const user = users.find(u => u._id === id);
        if (!user) return;
        setUserToToggle({ id: user._id, name: user.fullName || 'المستخدم', isDeleted: !!user.isDeleted });
        setShowToggleModal(true);
    };

    const handleConfirmToggle = async () => {
        if (userToToggle) {
            setToggleLoading(true);
            await toggleUserStatus(userToToggle.id);
            setToggleLoading(false);
            setShowToggleModal(false);
            setUserToToggle(null);
        }
    };

    const handleFormSubmit = async (formData: any) => {
        if (editingUser) {
            await updateUser(editingUser._id, formData);
        } else {
            await addUser(formData);
        }
        setIsModalOpen(false);
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            role: 'all',
            university: 'all',
            department: 'all',
            status: 'all',
        });
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-600 text-4xl">group</span>
                            المستخدمين
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة جميع مستخدمي النظام</p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        إضافة مستخدم
                    </button>
                </div>

                <UserStats stats={stats} loading={statsLoading} />

                <UserFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    universities={universities}
                    departments={departments}
                    loading={loading}
                />

                {loading && <LoadingSpinner  />}

                {!loading && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">group</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد مستخدمين</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">لا توجد مستخدمين تطابق معايير البحث</p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        onView={handleViewClick}
                                        onEdit={handleEditClick}
                                        onUpdateRole={handleUpdateRole}
                                        onToggleStatus={handleToggleStatusClick}
                                        onDelete={() => {}}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                editingUser={editingUser}
                loading={loading}
                universities={universities}
                departments={departments}
                onUniversityChange={handleUniversityChange}
                fetchingDepartments={fetchingDepartments}
            />

            {/* User Details Modal */}
            {showDetailsModal && selectedUserId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تفاصيل المستخدم</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            {/* تفاصيل المستخدم */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">الاسم</p>
                                    <p className="font-semibold">{users.find(u => u._id === selectedUserId)?.fullName}</p>
                                </div>
                                {/* باقي التفاصيل... */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Toggle Modal */}
            <ConfirmationDialog
                isOpen={showToggleModal}
                title={userToToggle?.isDeleted ? 'استعادة مستخدم' : 'حذف مستخدم'}
                message={userToToggle?.isDeleted 
                    ? `هل أنت متأكد من استعادة المستخدم "${userToToggle?.name}"؟`
                    : `هل أنت متأكد من حذف المستخدم "${userToToggle?.name}"؟ هذا الإجراء يمكن التراجع عنه.`}
                confirmText={userToToggle?.isDeleted ? 'استعادة' : 'حذف'}
                cancelText="إلغاء"
                onConfirm={handleConfirmToggle}
                onClose={() => setShowToggleModal(false)}
                onCancel={() => setShowToggleModal(false)}
                isLoading={toggleLoading}
            />
        </main>
    );
};

export default UsersManagement;