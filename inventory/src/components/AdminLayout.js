import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopbarAdmin from "../components/TopbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import "../styles/Layout.css";

export default function AdminLayout({ children, role }) {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen(prev => !prev);

    return (
        <div className="layout-container">
            <TopbarAdmin toggleSidebar={toggleSidebar} />
            <div className="layout-body">
                <SidebarAdmin isOpen={isOpen} />
                <main className={`page-content ${isOpen ? "with-sidebar" : "full-width"}`}>
                    <Outlet />
                    {children}
                </main>
            </div>
        </div>
    );
}

