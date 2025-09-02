// import React from "react";
// import { Outlet } from "react-router-dom";
// import Employee_Navbar from "./employee_Navbar";

// const Employee_dashboard = () => {

//     return (
//         <div style={{backgroundColor: 'rgb(226, 239, 248)', minHeight: '100vh', backgroundImage: `url('/lunovian_logo.png')`, backgroundRepeat: 'no-repeat',
//             backgroundSize: 'cover', backgroundPosition: 'center'
//         }}>
//             <Employee_Navbar />
            
//             <div className="container my-4 pb-4">
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default Employee_dashboard;

import React from "react";
import { Outlet } from "react-router-dom";
import Employee_Navbar from "./employee_Navbar";

const Employee_dashboard = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "rgb(226, 239, 248)" }}>
      
      {/* Watermark background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/lunovian_logo.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // adjust size
          backgroundPosition: "center",
          opacity: 0.5, // faded look
          pointerEvents: "none", // so it won’t block clicks
        }}
      ></div>

      {/* Foreground content */}
      <Employee_Navbar />
      <div className="container my-4 pb-4" style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Employee_dashboard;
