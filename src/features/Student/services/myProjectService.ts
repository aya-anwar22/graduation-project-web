// services/project.service.ts
import axios from "axios";
import type { ProjectResponse } from "../types/myProject.interface";

export const getMyProject = async (): Promise<ProjectResponse> => {
    const token = localStorage.getItem("accessToken");
    // const url = 'http://localhost:3000'
    const url = import.meta.env.VITE_API_URL;
    const res = await axios.get<ProjectResponse>(
        `${url}/api/v1/projects/my-project`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    console.log("projectData: ", res);

    return res.data;
};
