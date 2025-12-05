import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function SidebarAdmin({ isOpen }) {
    const [alertCount, setAlertCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const count = localStorage.getItem("alertCount");
        setAlertCount(Number(count) || 0);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <nav className="sidebar-nav">

                <Link to="/admin/products">Inventory</Link>
                <Link to="/admin/stock">Stock Info</Link>
                <Link to="/admin/reports">Reports</Link>

                <Link to="/admin/alerts" className="alert-link">
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
                <button className="logout-icon" onClick={handleLogout}>
                    <MdLogout className="logout-icon-symbol" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
