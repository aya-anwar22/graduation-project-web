// src/features/Admin/DoctorsAdmin/DoctorsList.tsx
import React from 'react';
import type { Doctor } from '../AdminTypes/Doctor.interface';
import { DoctorCard } from './DoctorCard';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

interface DoctorsListProps {
    doctors: Doctor[];
    loading: boolean;
    onRefresh: () => void;
}

export const DoctorsList: React.FC<DoctorsListProps> = ({
    doctors,
    loading,
    onRefresh,
}) => {
    if (loading) {
        return <LoadingSpinner  />;
    }

    if (doctors.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">psychology</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا يوجد دكاترة</h3>
                <p className="text-gray-500 dark:text-gray-400">لا توجد دكاترة تطابق معايير البحث</p>
            </div>
        );
    }

    return (
        <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
            <div className="space-y-4">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        onRefresh={onRefresh}
                    />
                ))}
            </div>
        </div>
    );
};