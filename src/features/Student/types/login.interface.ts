import type { JSX } from "react";

export interface Login {
    email: string;
    password: string;
}
// interfaces.ts
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}
export interface DecodedToken {
    id: string;
    email: string;
    role: "doctor" | "supervisor" | "student";
    exp: number;
}

export interface Props {
    children: JSX.Element
    allowedRoles?: ('doctor' | 'student')[]
}
