import React from "react";
import './App.css';

import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
      <Navbar />

      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        <Sidebar />

        <main className="flex-grow-1 p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 56px)', backgroundColor: 'rgb(226, 239, 248)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
