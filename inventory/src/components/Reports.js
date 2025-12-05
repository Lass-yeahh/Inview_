import { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../styles/Reports.css";

function Reports() {
    const [type, setType] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTransactions() {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get("https://localhost:7195/api/transaction", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                setData(response.data);
            } catch (err) {
                setError("Failed to load transactions from server.");
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    const filtered = data.filter((r) => {
        if (type !== "all" && r.type.toLowerCase() !== type) return false;
        const transactionDate = new Date(r.date);
        const fromDateObj = fromDate ? new Date(fromDate) : null;
        const toDateObj = toDate ? new Date(toDate) : null;
        const transactionDateOnly = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
        const fromDateOnly = fromDateObj ? new Date(fromDateObj.getFullYear(), fromDateObj.getMonth(), fromDateObj.getDate()) : null;
        const toDateOnly = toDateObj ? new Date(toDateObj.getFullYear(), toDateObj.getMonth(), toDateObj.getDate()) : null;
        if (fromDateOnly && transactionDateOnly < fromDateOnly) return false;
        if (toDateOnly && transactionDateOnly > toDateOnly) return false;

        return true;
    });

    const totalIn = filtered
        .filter((r) => r.type.toLowerCase() === "in")
        .reduce((acc, r) => acc + r.quantity, 0);

    const totalOut = filtered
        .filter((r) => r.type.toLowerCase() === "out")
        .reduce((acc, r) => acc + r.quantity, 0);

    const categoryMap = {};
    filtered.forEach(({ category, type, quantity }) => {
        if (!categoryMap[category]) categoryMap[category] = { category, stockIn: 0, stockOut: 0 };
        if (type.toLowerCase() === "in") categoryMap[category].stockIn += quantity;
        else if (type.toLowerCase() === "out") categoryMap[category].stockOut += quantity;
    });
    const chartData = Object.values(categoryMap);

    return (
        <div className="reports-container">
            <h2 className="title">Inventory Reports</h2>

            <div className="filters-section">
                <div>
                    <label>Report Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="all">All</option>
                        <option value="in">Stock In</option>
                        <option value="out">Stock Out</option>
                    </select>
                </div>

                <div>
                    <label>From</label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>

                <div>
                    <label>To</label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
            </div>

            {loading && <p>Loading data...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="summary-single-card card">
                        <h3>Inventory Summary</h3>
                        <p><strong>Total Stock In:</strong> {totalIn}</p>
                        <p><strong>Total Stock Out:</strong> {totalOut}</p>
                        <p><strong>Net Movement:</strong> {totalIn - totalOut}</p>
                    </div>

                    <div className="chart-box" style={{ width: "100%", height: 300 }}>
                        {chartData.length === 0 ? (
                            <p>No chart data available</p>
                        ) : (
                            <ResponsiveContainer>
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="stockIn" fill="#10b981" name="Stock In" />
                                    <Bar dataKey="stockOut" fill="#f59e0b" name="Stock Out" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="no-data">No data available</td></tr>
                            ) : (
                                filtered.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.productName}</td>
                                        <td>{r.category}</td>
                                        <td className={r.type.toLowerCase() === "in" ? "in-text" : "out-text"}>
                                            {r.type.toLowerCase() === "in" ? "Stock In" : "Stock Out"}
                                        </td>
                                        <td>{r.quantity}</td>
                                        <td>{new Date(r.date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default Reports;
