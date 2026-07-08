import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";



export default function Layout() {




    return (
        <>
            <Navbar />
            <div className=" min-h-screen flex flex-col lg:mr-72 transition-all duration-300">
                <main className="flex-1 bg-gray-50 mt-25 md:mt-0">
                    
                    <Outlet  />
                </main>
                {/* <Footer /> */}
            </div>
        </>

    )
}




