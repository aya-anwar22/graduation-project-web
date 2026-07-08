import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../../utlis/decoded";

interface PublicRouteProps {
    children: ReactNode;
}

interface ProtectRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export function PublicRoute({ children }: PublicRouteProps) {
    const token = localStorage.getItem("accessToken");

    if (token) return <Navigate to="/" replace />
    
    return children;
}

export default function ProtectRoute({ children, allowedRoles }: ProtectRouteProps) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
        return <Navigate to="/login" replace />;
    }

    const role = decoded.role?.toLowerCase();

    // console.log("User Role:", role);
    // console.log("Allowed Roles:", allowedRoles);
    if (allowedRoles && !allowedRoles.map((r: string) => r.toLowerCase()).includes(role)) {
        // Redirect حسب الدور
        switch (role) {
            case 'doctor':
                return <Navigate to="/doctor" replace />;
            case 'student':
                return <Navigate to="/" replace />;
            case 'admin':
                return <Navigate to="/admin" replace />;
            default:
                return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
}