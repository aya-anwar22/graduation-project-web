// src/hooks/useUniversities.ts
import { useState, useEffect, useCallback } from 'react';
import type { StatsData, University, UniversityApiData, UniversityFormData } from '../features/Admin/AdminTypes/Universty.interface';
import universityService from '../features/Admin/AdminService/University.service';

export const useUniversities = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [stats, setStats] = useState<StatsData>({
        totalUniversities: 0,
        totalDepartments: 0,
        totalDoctors: 0,
        totalProjects: 0,
    });

    // تحويل البيانات من API إلى صيغة الواجهة
    const transformApiDataToUniversity = (apiData: UniversityApiData, index: number): University => {
        // الحالة الافتراضية نشط (لأن الـ API مش بيرجع isDeleted)
        let status: 'active' | 'deleted' = 'active';
        
        // لو في isDeleted نستخدمه
        if (apiData.isDeleted === true) {
            status = 'deleted';
        }
        
        return {
            id: apiData._id || index.toString(),
            name: apiData.universityName || '',
            location: apiData.location || '',
            email: apiData.contactEmail || '',
            status: status,  // الحالة الافتراضية نشط
            departments: apiData.departmentsCount || 0,
            doctors: apiData.doctorsCount || 0,
            projects: apiData.projectsCount || 0,
            logo: apiData.universityName?.substring(0, 2) || 'جا',
        };
    };

    // جلب الجامعات
    const fetchUniversities = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await universityService.getUniversities();
            const transformed = data.map((uni, i) => transformApiDataToUniversity(uni, i));
            setUniversities(transformed);
            setStats({
                totalUniversities: transformed.length,
                totalDepartments: transformed.reduce((s, u) => s + u.departments, 0),
                totalDoctors: transformed.reduce((s, u) => s + u.doctors, 0),
                totalProjects: transformed.reduce((s, u) => s + u.projects, 0),
            });
        } catch (err: any) {
            setError(err.message || 'فشل في تحميل الجامعات');
        } finally {
            setLoading(false);
        }
    }, []);

    // إضافة جامعة
    const addUniversity = useCallback(async (formData: UniversityFormData) => {
        setLoading(true);
        try {
            await universityService.createUniversity(formData);
            setSuccess('تم إضافة الجامعة بنجاح');
            await fetchUniversities();
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في إضافة الجامعة');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [fetchUniversities]);

    // تحديث جامعة
    const updateUniversity = useCallback(async (id: string, formData: Partial<UniversityFormData>) => {
        setLoading(true);
        try {
            await universityService.updateUniversity(id, formData);
            setSuccess('تم تحديث الجامعة بنجاح');
            await fetchUniversities();
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في تحديث الجامعة');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [fetchUniversities]);

    // تبديل حالة الجامعة (حذف/استعادة) - تحديث محلي بدون إعادة تحميل كامل
    const toggleUniversityStatus = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const result = await universityService.toggleUniversityStatus(id);
            
            // تحديث الحالة محلياً بدون إعادة تحميل من API
            setUniversities(prevUniversities => 
                prevUniversities.map(uni => 
                    uni.id === id 
                        ? { ...uni, status: uni.status === 'active' ? 'deleted' : 'active' }
                        : uni
                )
            );
            
            // تحديث الإحصائيات محلياً
            setStats(prevStats => {
                const toggledUni = universities.find(u => u.id === id);
                if (toggledUni) {
                    const isBecomingDeleted = toggledUni.status === 'active';
                    return {
                        ...prevStats,
                        totalUniversities: isBecomingDeleted ? prevStats.totalUniversities - 1 : prevStats.totalUniversities + 1,
                    };
                }
                return prevStats;
            });
            
            setSuccess(result.message);
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في تغيير حالة الجامعة');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [universities]);

    // فلترة الجامعات
    const filterUniversities = useCallback((searchTerm: string, statusFilter: string) => {
        if (!Array.isArray(universities)) return [];
        
        return universities.filter(uni => {
            const matchesSearch = !searchTerm ||
                uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = !statusFilter || uni.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [universities]);

    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);

    return {
        universities,
        stats,
        loading,
        error,
        success,
        addUniversity,
        updateUniversity,
        toggleUniversityStatus,
        filterUniversities,
        refetch: fetchUniversities,
    };
};