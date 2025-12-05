import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Alerts.css";

function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const res = await axios.get("https://localhost:7195/api/Inventory/lowstock", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAlerts(res.data);
                localStorage.setItem("alertCount", res.data.length);

            } catch (err) {
                setError("Failed to load alerts");
            } finally {
                setLoading(false);
            }
        };

        fetchLowStock();
    }, []);

    if (loading) return <p>Loading alerts...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="alerts-container">
            <h2>Stock Alerts</h2>

            {alerts.length === 0 ? (
                <p className="no-alerts">All items are in good stock</p>
            ) : (
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {alerts.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.sku}</td>
                                <td>{item.quantity}</td>

                                <td>
                                    <span
                                        className={
                                            item.quantity <= 2
                                                ? "critical blink"
                                                : "warning"
                                        }
                                    >
                                        {item.quantity <= 2 ? "Critical" : "Low Stock"}
                                    </span>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default Alerts;
