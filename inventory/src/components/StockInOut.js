import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/StockInOut.css";

function StockInOut() {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [type, setType] = useState("IN");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [transactions, setTransactions] = useState([]);

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username") || "";
    useEffect(() => {
        axios
            .get("https://localhost:7195/api/inventory", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setProducts(res.data))
            .catch(() => setMessage("Failed to load products"));
    }, []);
    useEffect(() => {
        axios
            .get("https://localhost:7195/api/transaction", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setTransactions(res.data))
            .catch(() => console.log("Could not load transactions"));
    }, []);
    useEffect(() => {
        if (message) setMessage("");
    }, [productId, quantity, type]);


    const submit = async (e) => {
        e.preventDefault();

        if (!productId || !quantity) {
            setMessage("Please fill all required fields");
            return;
        }

        const data = {
            inventoryId: parseInt(productId),
            type,
            quantity: parseInt(quantity),
            staff: username,
        };

        try {
            const res = await axios.post(
                "https://localhost:7195/api/transaction",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Transaction successful!");
            setTransactions([res.data, ...transactions]);
            setProductId("");
            setQuantity("");
        } catch (err) {
            if (err.response?.status === 400) {
                setMessage(err.response.data);
            } else {
                setMessage("Transaction failed");
            }
        }
    };

    return (
        <div className="stock-container">
            <h2>Stock Information</h2>

            {message && <p className="msg">{message}</p>}

            <form className="stock-form" onSubmit={submit}>
                <label>Product</label>
                <select value={productId} onChange={(e) => setProductId(e.target.value)}>
                    <option value="">Select Product</option>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} (Current: {p.quantity})
                        </option>
                    ))}
                </select>

                <label>Transaction Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="IN">Stock IN</option>
                    <option value="OUT">Stock OUT</option>
                </select>

                <label>Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <button type="submit" disabled={!productId || !quantity}>
                    Submit
                </button>
            </form>
            <h3>Recent Transactions</h3>
            <table className="tx-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Staff</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td>{t.productName}</td>
                            <td>{t.category}</td>
                            <td className={t.type === "IN" ? "green" : "red"}>{t.type}</td>
                            <td>{t.quantity}</td>
                            <td>{t.staff}</td>
                            <td>{new Date(t.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockInOut;
