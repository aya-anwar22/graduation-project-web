import { api } from '../../Student/services/axiosInstance';
import type { DoctorProfileData, UpdateDoctorProfileData, ProfileStats } from '../TypesDoctor/doctorProfile.interfase';

export const doctorProfileService = {
    // جلب بيانات الملف الشخصي للدكتور
    async getDoctorProfile(): Promise<{ success: boolean; data: DoctorProfileData }> {
        try {
            const response = await api.get('/doctor-specialization/my-profile');

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                throw new Error(response.data.message || 'فشل في جلب بيانات الملف الشخصي');
            }
        } catch (error: any) {
            console.error('Error fetching doctor profile:', error);
            throw new Error(error.response?.data?.message || 'حدث خطأ في جلب بيانات الملف الشخصي');
        }
    },

    // تحديث بيانات الملف الشخصي للدكتور
    async updateDoctorProfile(updatedData: UpdateDoctorProfileData): Promise<{ success: boolean; data: DoctorProfileData }> {
        try {
            // معالجة الصورة إذا كانت موجودة
            if (updatedData.profileImage instanceof File) {
                const formData = new FormData();

                // إضافة الحقول النصية الأساسية
                if (updatedData.fullName !== undefined) formData.append('fullName', updatedData.fullName);
                if (updatedData.phoneNumber !== undefined) formData.append('phoneNumber', updatedData.phoneNumber);
                if (updatedData.bio !== undefined) formData.append('bio', updatedData.bio);

                // إضافة الحقول الأكاديمية بشكل فردي (ليس ككائن)
                if (updatedData.academicInfo) {
                    if (updatedData.academicInfo.academicTitle !== undefined)
                        formData.append('academicTitle', updatedData.academicInfo.academicTitle);

                    if (updatedData.academicInfo.academicDegree !== undefined)
                        formData.append('academicDegree', updatedData.academicInfo.academicDegree);

                    if (updatedData.academicInfo.yearsOfExperience !== undefined)
                        formData.append('yearsOfExperience', updatedData.academicInfo.yearsOfExperience.toString());

                    if (updatedData.academicInfo.specialization !== undefined && Array.isArray(updatedData.academicInfo.specialization))
                        formData.append('specialization', JSON.stringify(updatedData.academicInfo.specialization));
                }

                // إضافة الصورة
                formData.append('profileImage', updatedData.profileImage);

                console.log('Sending FormData with fields:', {
                    fullName: updatedData.fullName,
                    phoneNumber: updatedData.phoneNumber,
                    bio: updatedData.bio,
                    academicTitle: updatedData.academicInfo?.academicTitle,
                    academicDegree: updatedData.academicInfo?.academicDegree,
                    yearsOfExperience: updatedData.academicInfo?.yearsOfExperience,
                    specialization: updatedData.academicInfo?.specialization,
                    hasImage: true
                });

                // استخدام PUT بدلاً من PATCH إذا كان الـ API يتطلب PUT
                const response = await api.patch('/doctor-specialization/update-profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    return {
                        success: true,
                        data: response.data.data
                    };
                } else {
                    throw new Error(response.data.message || 'فشل في تحديث بيانات الملف الشخصي');
                }
            } else {
                // البيانات النصية فقط (بدون صورة)
                const payload: any = {};

                // إضافة الحقول النصية الأساسية
                if (updatedData.fullName !== undefined) payload.fullName = updatedData.fullName;
                if (updatedData.phoneNumber !== undefined) payload.phoneNumber = updatedData.phoneNumber;
                if (updatedData.bio !== undefined) payload.bio = updatedData.bio;

                // إضافة الحقول الأكاديمية بشكل فردي (ليس ككائن)
                if (updatedData.academicInfo) {
                    if (updatedData.academicInfo.academicTitle !== undefined)
                        payload.academicTitle = updatedData.academicInfo.academicTitle;

                    if (updatedData.academicInfo.academicDegree !== undefined)
                        payload.academicDegree = updatedData.academicInfo.academicDegree;

                    if (updatedData.academicInfo.yearsOfExperience !== undefined)
                        payload.yearsOfExperience = updatedData.academicInfo.yearsOfExperience;

                    if (updatedData.academicInfo.specialization !== undefined && Array.isArray(updatedData.academicInfo.specialization))
                        payload.specialization = updatedData.academicInfo.specialization;
                }

                console.log('Sending payload:', payload);

                // استخدام PUT بدلاً من PATCH
                const response = await api.patch('/doctor-specialization/update-profile', payload);

                if (response.data.success) {
                    return {
                        success: true,
                        data: response.data.data
                    };
                } else {
                    throw new Error(response.data.message || 'فشل في تحديث بيانات الملف الشخصي');
                }
            }
        } catch (error: any) {
            console.error('Error updating doctor profile:', error.response?.data || error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'حدث خطأ في تحديث بيانات الملف الشخصي';
            throw new Error(errorMessage);
        }
    },

    // جلب إحصائيات الدكتور
    async getDoctorStats(): Promise<ProfileStats> {
        try {
            return {
                totalProjects: 24,
                totalStudents: 47,
                totalTeams: 12,
                pendingRequests: 3
            };
        } catch (error) {
            console.error('Error fetching doctor stats:', error);
            return {
                totalProjects: 0,
                totalStudents: 47,
                totalTeams: 0,
                pendingRequests: 0
            };
        }
    }
};