import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SingUpForm } from './features/auth/singUpForm'
import Layout from './components/Layout/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectRoute, { PublicRoute } from './components/ProtecteRoute/ProtectRoute'
import { LoginForm } from './features/auth/login'
import { Verify } from './features/auth/verify'
import { ForgetPassword } from './features/auth/forgetPassword'
import { ResetPassword } from './features/auth/resetPassword'
import SupervisionRequest from './features/Student/Supervisor/Supervisor.js'
import StudentProfile from './features/Student/Profile/Profile.js'
import MyProject from './features/Student/MyProject/MyProject.js'
import TeamPage from './features/Student/MyTeam/MyTeam.js'
import DashboardPage from './features/Student/Home/Home.js'
import ProjectDetailsPage from './features/Student/ProjectDetails/ProjectDetails.js'
import LayoutDoctor from './components/LayoutDoctor/LayoutDoctor.js'
import DoctorProfilePage from './features/Doctore/ProfileDoctor/ProfileDoctor.js'
import ProjectsDashboard from './features/Doctore/Projects/Proojects.js'
import SupervisionRequests from './features/Doctore/RequestOrder/RequestOrder.js'
import TeamsDashboard from './features/Doctore/Teams/Teams.js'
import StudentsDashboard from './features/Doctore/Studends/Students.js'
import ToastProvider from './contexts/ToastProvider.js'
import * as ProjectDetailsModule from './features/Doctore/Projects/ProjectDetails.js'
const ProjectDetailsComponent = (ProjectDetailsModule as unknown as { default: React.FC }).default;
import HomeDoctor from './features/Doctore/HomeDoctor/HomeDoctor.js'
import LayoutAdmin from './components/LayoutAdmin/LayoutAdmin.js'
// import DashboardAdmin from './features/Admin/AdminHome/AdminHome.js'
import { useEffect, useState } from 'react'
import ProjectSplashScreen from './components/ProjectSplashScreen/ProjectSplashScreen.js'
import logoImage from './assets/WhatsApp Image 2026-03-07 at 3.34.22 PM.jpeg'
import { UniversitiesManagement } from './features/Admin/UnvirstyAdmin/UnvirstyAdmin.js'
import { DepartmentsManagement } from './features/Admin/Department/DepartmentManagement.js'
import { DoctorsManagement } from './features/Admin/DoctorsAdmin/DoctorsManagement.js'
import { ProjectsManagement } from './features/Admin/ProjectAdmin/ProjectsManagement.js'
import { TeamsManagement } from './features/Admin/TeamAdmin/TeamsManagement.js'
import { UsersManagement } from './features/Admin/Users/UsersManagement.js'
import { NotificationsManagement } from './features/Admin/Notification/NotificationsManagement.js'
import { ProfileManagement } from './features/Admin/PrpfileAdmin/ProfileManagement.js'
import { DashboardManagement } from './features/Admin/AdminHome/DashboardManagement.js'
import StudentProjects from './features/Student/AllProjects/StudentProjects.js'
const routers = createBrowserRouter([
  // Public
  { path: "/sign-up", element: <PublicRoute><SingUpForm /></PublicRoute> },
  { path: "/login", element: <PublicRoute><LoginForm /></PublicRoute> },
  { path: "verify", element: <PublicRoute><Verify /></PublicRoute> },
  { path: "forget-password", element: <PublicRoute><ForgetPassword /></PublicRoute> },
  { path: "reset-password", element: <PublicRoute><ResetPassword /></PublicRoute> },

  // Private Student
  {
    path: "",
    element: (
      <ProtectRoute allowedRoles={['student']}>
        <Layout />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "request", element: <SupervisionRequest /> },
      { path: "profile", element: <StudentProfile /> },
      { path: "myProject", element: <MyProject /> },
      { path: "myTeam", element: <TeamPage /> },
      { path: "projects", element: <StudentProjects /> },
      { path: "project/:projectId", element: <ProjectDetailsPage /> },
    ],
  },
  // Private Doctor 
  {
    path: "doctor/",
    element: (
      <ProtectRoute allowedRoles={['doctor']}>
        <LayoutDoctor />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <HomeDoctor /> },
      { path: 'profileDoctor', element: <DoctorProfilePage /> },
      { path: 'projectDoctor', element: <ProjectsDashboard /> },
      { path: 'projectDoctor/:projectId', element: <ProjectDetailsComponent /> },
      { path: 'requests', element: <SupervisionRequests /> },
      { path: 'teams', element: <TeamsDashboard /> },
      { path: 'students', element: <StudentsDashboard /> },
    ]
  },
  {
    path:'admin/',
    element:(
      <ProtectRoute allowedRoles={['admin']}>
        <LayoutAdmin/>
      </ProtectRoute>
    ),
    children:[
      {index:true,element:<DashboardManagement/>},
      {path:'universities',element:<UniversitiesManagement/>},
      {path:'departments',element:<DepartmentsManagement/>},
      {path:'doctors',element:<DoctorsManagement/>},
      {path:'projects',element:<ProjectsManagement/>},
      {path:'teams',element:<TeamsManagement/>},
      {path:'users',element:<UsersManagement/>},
      {path:'notifications',element:<NotificationsManagement/>},
      {path:'profile',element:<ProfileManagement/>},

    ]
  }

])

// const RoleRedirect = () => {
//   const { user } = useSelector((state) => state.auth);

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   switch (user.role) {
//     case 'Doctor':
//       return <Navigate to="/doctor" replace />;
//     case 'Student':
//       return <Navigate to="/" replace />;
//     default:
//       return <Navigate to="/unauthorized" replace />;
//   }
// };

const query = new QueryClient();

function App() {

 const [showSplash, setShowSplash] = useState(true);
    // appReady itself isn't read anywhere yet, only the setter is used.
    const [, setAppReady] = useState(false);

    useEffect(() => {
        // محاكاة تحميل البيانات
        const loadApp = async () => {
            // لو عايز تحمل حاجة من API
            // await fetchUserData();
            // await loadSettings();
            
            setAppReady(true);
        };

        loadApp();
    }, []);

    const handleSplashFinish = () => {
        setShowSplash(false);
    };

    // لو لسه في تحميل والـ splash مختفيش
    if (showSplash) {
        return (
            <ProjectSplashScreen 
                onFinish={handleSplashFinish} 
                duration={3000}
                logo={logoImage} // لو عندك صورة لوجو
            />
        );
    }


  return (
    <QueryClientProvider client={query}>
      <ToastProvider>
        <RouterProvider router={routers}></RouterProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App