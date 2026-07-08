import { Outlet } from "react-router-dom";
import Sidebar from "../sideBarDoctor/SideBarDoctor";



export default function LayoutDoctor() {




    return (
        <>
            <Sidebar />
            <div className=" min-h-screen flex flex-col lg:mr-72 transition-all duration-300">
                <main className="flex-1 bg-gray-50 mt-25 md:mt-0">
                    
                    <Outlet  />
                </main>
                {/* <Footer /> */}
            </div>
        </>

    )
}




