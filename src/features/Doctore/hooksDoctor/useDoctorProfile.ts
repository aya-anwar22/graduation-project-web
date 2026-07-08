import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DoctorProfileData } from '../TypesDoctor/doctorProfile.interfase';
import { doctorProfileService } from '../DoctorServices/doctorProfileService';

export const useDoctorProfile = () => {
    return useQuery<DoctorProfileData>({
        queryKey: ['doctorProfile'],
        queryFn: async () => {
            const response = await doctorProfileService.getDoctorProfile();
            return response.data;
        },
    });
};

export const useUpdateDoctorProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: doctorProfileService.updateDoctorProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
        },
    });
};
