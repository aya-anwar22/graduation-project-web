// src/hooks/useFilteredDoctors.ts
import { useEffect, useMemo } from 'react';

interface UseFilteredDoctorsProps {
    doctors: any[];
    selectedDepartment: string;
    selectedSupervisor: string;
    setSelectedSupervisor: (value: string) => void;
}

export const useFilteredDoctors = ({
    doctors,
    selectedDepartment,
    selectedSupervisor,
    setSelectedSupervisor
}: UseFilteredDoctorsProps) => {
    // ✅ فلترة الدكاترة حسب القسم المختار
    const filteredDoctors = useMemo(() => {
        if (!selectedDepartment) {
            return doctors; // عرض كل الدكاترة لو مفيش قسم مختار
        }

        return doctors.filter(doctor => {
            // التحقق من أن الدكتور له أقسام
            if (!doctor.departments || doctor.departments.length === 0) {
                return false;
            }

            // التحقق من أن الدكتور ينتمي للقسم المختار
            return doctor.departments.some(
                (dept: any) => dept._id === selectedDepartment || dept.departmentId === selectedDepartment
            );
        });
    }, [doctors, selectedDepartment]);

    // ✅ إعادة تعيين الدكتور المختار لو مش موجود في القائمة الجديدة
    useEffect(() => {
        if (selectedSupervisor) {
            const stillExists = filteredDoctors.some(
                doctor => doctor._id === selectedSupervisor
            );
            if (!stillExists) {
                setSelectedSupervisor('');
            }
        }
    }, [filteredDoctors, selectedSupervisor, setSelectedSupervisor]);

    return filteredDoctors;
};