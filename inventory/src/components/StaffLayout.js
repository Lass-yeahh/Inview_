import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarStaff from "../components/SidebarStaff";
import TopbarStaff from "../components/TopbarStaff";
import "../styles/Layout.css";

export default function StaffLayout() {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen(prev => !prev);

    return (
        <div className="layout-container">
            <TopbarStaff toggleSidebar={toggleSidebar} />
            <div className="layout-body">
                <SidebarStaff isOpen={isOpen} />
                <main className={`page-content ${isOpen ? "with-sidebar" : "full-width"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
