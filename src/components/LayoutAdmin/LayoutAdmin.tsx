import { Outlet } from "react-router-dom";
import SidebarAdmin from "../sideBarAdmin/SideBarAdmin";

export default function LayoutAdmin() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Sidebar ثابت */}
            <SidebarAdmin />
            
            {/* المحتوى الرئيسي - يأخذ باقي المساحة ويعمل scroll */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}