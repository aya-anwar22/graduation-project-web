import type { ApiStudentProfileResponse, UpdateProfileDto } from "../types/profile.interface";
import { api } from "./axiosInstance";



export const getProfile = async (): Promise<ApiStudentProfileResponse> => {
    const [profile] = await Promise.all([
        api.get<ApiStudentProfileResponse>(`/users/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
    ])
    console.log({ "ProfileData": profile.data });
    return profile.data;
}


// export const updateProfile = async (data: UpdateProfileDto) => {
//     try {
//         const response = await api.patch("/users/profile", data);
//         return response.data;
//     } catch (error: any) {
//         console.error("Error updating profile:", error.response?.data || error.message);
//         throw error; // ترمي الخطأ بعد تسجيله عشان الكومبوننت يمسكه
//     }
// };
export const updateProfile = async (data: UpdateProfileDto) => {
    const formData = new FormData();

    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.bio) formData.append("bio", data.bio);

    if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
    }
    const response = await api.patch("/users/profile", formData);

    return response.data;
};
