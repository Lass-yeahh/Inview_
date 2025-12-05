import React, { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function SidebarStaff({ isOpen }) {
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        const count = localStorage.getItem("alertCount");
        setAlertCount(Number(count) || 0);
    }, []);

    return (
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <nav className="sidebar-nav">
                <Link to="/staff/products">Inventory</Link>
                <Link to="/staff/stock">Stock Info</Link>
                <Link to="/staff/alerts">
                    Alerts
                    {alertCount > 0 && (
                        <span className="alert-container">
                            <span className="alert-bulb">🚨</span>
                            <span className="alert-number">{alertCount}</span>
                        </span>
                    )}
                    </Link>
                    </nav>
            <div className="logout-bottom">
                <Link
                    to="/login"
                    onClick={() => localStorage.clear()}
                    className="logout-icon"
                >
                    <MdLogout className="logout-icon-symbol" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
