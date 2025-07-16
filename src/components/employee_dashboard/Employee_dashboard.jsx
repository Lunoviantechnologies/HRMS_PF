import React from "react";
import { Outlet } from "react-router-dom";
import Employee_Navbar from "./employee_Navbar";

const Employee_dashboard = () => {

    return (
        <div style={{backgroundColor: 'rgb(226, 239, 248)', minHeight: '100vh'}}>
            <Employee_Navbar />
            
            <div className="container my-4 pb-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Employee_dashboard;