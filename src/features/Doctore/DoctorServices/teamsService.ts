import { api } from "../../Student/services/axiosInstance";

// services/team.service.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getTeamStats = async () => {
    try {
        const token = localStorage.getItem('accessToken'); // أو من أي مكان تخزن فيه التوكن

        const response = await fetch(`${API_BASE_URL}/api/v1/doctor-specialization/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error('Error fetching team stats:', error);
        throw error;
    }
};

export const updateProjectStatusWithFetch = async (projectId: string, status: 'start' | 'in_progress' | 'completed') => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Unauthorized - No token found');
        }

        console.log('📤 Updating project status (fetch):', { projectId, status });

        const response = await fetch(`${API_BASE_URL}/api/v1/projects/doctor/projects/${projectId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Error response:', errorData);
            throw new Error(`Failed to update status: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('✅ Project status updated:', data);
        return data;
    } catch (error) {
        console.error('❌ Error updating project status:', error);
        throw error;
    }
};


export const getTeams = async (page: number = 1, limit: number = 10) => {
    try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${API_BASE_URL}/api/v1/teams/doctor-teams?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};

export const getTeamDetails = async (teamId: string) => {
    try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${API_BASE_URL}/api/v1/teams/details/${teamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching team details:', error);
        throw error;
    }
};