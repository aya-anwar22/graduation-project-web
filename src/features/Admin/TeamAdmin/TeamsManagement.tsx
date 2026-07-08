// src/components/admin/TeamsManagement.tsx
import React, { useState, useMemo } from 'react';
import { TeamStats } from './TeamStats';
import { TeamFilters } from './TeamFilters';
import { TeamCard } from './TeamCard';
import { TeamDetailsModal } from './TeamDetailsModal';
import { useTeams } from '../../../hooks/useTeams';
import { Alert } from '../../../components/common/Alert';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';
import { ConfirmModal } from '../DoctorsAdmin/ConfirmModal';

// تعريف نوع الفلاتر
interface FiltersType {
    search: string;
    supervisor: string;
    year: string;
}

export const TeamsManagement: React.FC = () => {
    const {
        teams,
        supervisors,
        loading,
        statsLoading,
        stats,
        error,
        success,
        deleteTeam,
        filterTeams,
        refresh,
    } = useTeams();

    const [filters, setFilters] = useState<FiltersType>({
        search: '',
        supervisor: 'all',
        year: 'all',
    });

    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredTeams = useMemo(() => filterTeams(filters), [filterTeams, filters]);

    // تحديث دالة handleFilterChange لاستخدام النوع الصحيح
    const handleFilterChange = (key: keyof FiltersType, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewTeam = (team: any) => {
        setSelectedTeamId(team._id);
        setShowDetailsModal(true);
    };

    const handleEditTeam = (team: any) => {
        console.log('Edit team:', team);
    };

    const handleDeleteClick = (id: string) => {
        setTeamToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (teamToDelete) {
            setDeleteLoading(true);
            await deleteTeam(teamToDelete);
            setDeleteLoading(false);
            setShowDeleteModal(false);
            setTeamToDelete(null);
        }
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            supervisor: 'all',
            year: 'all',
        });
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                {/* Header */}
                <div className="animate-slide-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-600 text-4xl">groups</span>
                                إدارة الفِرَق
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة فرق المشاريع والأعضاء</p>
                        </div>
                    </div>

                    <TeamStats stats={stats} loading={statsLoading} />
                </div>

                {/* Filters */}
                <TeamFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    supervisors={supervisors}
                    loading={loading}
                />

                {/* Loading */}
                {loading && <LoadingSpinner />}

                {/* Teams List */}
                {!loading && (
                    <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
                        {filteredTeams.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">groups</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد فرق</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">لا توجد فرق تطابق معايير البحث</p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTeams.map((team) => (
                                    <TeamCard
                                        key={team._id}
                                        team={team}
                                        onView={handleViewTeam}
                                        onEdit={handleEditTeam}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="حذف فريق"
                message={`هل أنت متأكد من حذف هذا الفريق؟ هذا الإجراء لا يمكن التراجع عنه.`}
                confirmText="حذف"
                cancelText="إلغاء"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={deleteLoading}
            />

            {/* Team Details Modal */}
            <TeamDetailsModal
                teamId={selectedTeamId}
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTeamId(null);
                }}
            />
        </main>
    );
};