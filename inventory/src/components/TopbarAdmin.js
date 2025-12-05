import React from "react";
import { FaBars } from "react-icons/fa";
import "../styles/Topbar.css";

export default function TopbarAdmin({ toggleSidebar }) {
    return (
        <header className="topbar">
            <button
                className="menu-btn"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                <FaBars />
            </button>

            <div className="topbar-logo-wrapper">
                <img
                    src="/WinWireLogo 1.png"
                    alt="WinWire"
                    className="topbar-logo"
                />
            </div>

            <div className="topbar-right">Welcome, Admin</div>
        </header>
    );
}
