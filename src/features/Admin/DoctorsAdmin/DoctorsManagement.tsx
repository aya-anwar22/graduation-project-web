// src/features/Admin/DoctorsAdmin/DoctorsManagement.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { doctorService } from '../AdminService/Doctor.service';
import { DoctorsFilters } from './DoctorsFilters';
import { DoctorsStats } from './DoctorsStats';
import { DoctorsList } from './DoctorsList';
import type { Doctor, DoctorFilters } from '../AdminTypes/Doctor.interface';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

export const DoctorsManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        heads: 0,
        inactive: 0,
    });
    const [filters, setFilters] = useState<DoctorFilters>({
        search: '',
        departmentId: '',
        headFilter: '',
        title: '',
        status: '',
    });

    // جلب إحصائيات الدكاترة
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const data = await doctorService.getStats();
            setStats({
                total: data.totalDoctors,
                active: data.activeDoctors,
                heads: data.departmentHeads,
                inactive: data.inactiveDoctors,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // جلب قائمة الدكاترة
    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const data = await doctorService.getAll(filters);
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // فلترة الدكاترة حسب رؤساء الأقسام
    const filteredDoctors = useMemo(() => {
        let result = [...doctors];
        
        // فلترة رؤساء الأقسام
        if (filters.headFilter === 'yes') {
            result = result.filter(d => d.departments?.some(dept => dept.isHead));
        } else if (filters.headFilter === 'no') {
            result = result.filter(d => !d.departments?.some(dept => dept.isHead));
        }
        
        return result;
    }, [doctors, filters.headFilter]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const updateFilter = useCallback((key: keyof DoctorFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            departmentId: '',
            headFilter: '',
            title: '',
            status: '',
        });
    }, []);

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* العنوان */}
                <div className="animate-slide-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-600 text-4xl">psychology</span>
                                أعضاء هيئة التدريس
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة ومتابعة الدكاترة والأساتذة</p>
                        </div>
                    </div>

                    {/* الإحصائيات */}
                    {statsLoading ? (
                        <div className="h-32 flex items-center justify-center">
                            <LoadingSpinner  />
                        </div>
                    ) : (
                        <DoctorsStats stats={stats} />
                    )}
                </div>

                {/* الفلاتر */}
                <DoctorsFilters
                    filters={filters}
                    onFilterChange={updateFilter}
                    onReset={resetFilters}
                />

                {/* قائمة الدكاترة */}
                <DoctorsList 
                    doctors={filteredDoctors} 
                    loading={loading} 
                    onRefresh={fetchDoctors} 
                />
            </div>
        </main>
    );
};