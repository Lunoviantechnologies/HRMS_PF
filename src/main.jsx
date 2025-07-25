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
import Employee_LeaveRequest from './components/employee_dashboard/employee_LeaveRequest.jsx';

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
                path: '/dashboard/attendence',
                element: <Attendence />
            },
            {
                path: '/dashboard/addEmployee',
                element: <AddEmployee />
            },
            {
                path: '/dashboard/allEmployees',
                element: <EmployeesList />
            },
            {
                path: '/dashboard/leaveRequest',
                element: <LeaveRequest />
            }
        ]
    },
    {
        path : '/employee_dashboard',
        element : <Employee_dashboard/>,
        children:[
            {
                path: 'leaveRequest',
                element: <Employee_LeaveRequest />
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);
