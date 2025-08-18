import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import MainContent from './components/MainContent.jsx';
import AdminLogin from './components/authenticate/AdminLogin.jsx';
import AddEmployee from './components/admin_dashboard/AddEmployee.jsx';
import EmployeesList from './components/admin_dashboard/EmployeesList.jsx';
import Attendence from './components/admin_dashboard/Attendence.jsx';
import LeaveRequest from './components/admin_dashboard/LeaveRequest.jsx';
import AdminSignUp from './components/authenticate/AdminSignUp.jsx';
import AdminForgotPassword from './components/authenticate/adminForgetPassword.jsx';
import Employee_dashboard from './components/employee_dashboard/Employee_dashboard.jsx';
import AttendancePunch from './components/employee_dashboard/AttendencePunch.jsx';
import Employee_LeaveRequest from './components/employee_dashboard/employee_LeaveRequest.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LeavePolicyConfig from './components/admin_dashboard/LeavePolicyConfig.jsx';
import Admin_Profile from './components/admin_dashboard/admin_account/Admin_Profile.jsx';
import Admin_Settings from './components/admin_dashboard/admin_account/Admin_Settings.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AdminLogin />
    },
    {
        path: '/signUp',
        element: <AdminSignUp />
    },
    {
        path: '/forgotPassword',
        element: <AdminForgotPassword />
    },
    {
        path: '/dashboard',
        element: <App />,
        children: [
            {
                index: true,
                element: <MainContent />
            },
            {
                path: 'attendence',
                element: <Attendence />
            },
            {
                path: 'addEmployee',
                element: <AddEmployee />
            },
            {
                path: 'allEmployees',
                element: <EmployeesList />
            },
            {
                path: 'leaveRequest',
                element: <LeaveRequest />
            },
            {
                path: 'leavePolicy',
                element: <LeavePolicyConfig />
            },
            {
                path: 'profile_admin',
                element: <Admin_Profile />
            },
            {
                path: 'settings_admin',
                element: <Admin_Settings />
            }
        ]
    },
    {
        path : '/employee_dashboard',
        element : <Employee_dashboard/>,
        children:[
            {
                path: 'attendence',
                element: <AttendancePunch />
            },
            {
                path: 'leaveRequest',
                element: <Employee_LeaveRequest />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);