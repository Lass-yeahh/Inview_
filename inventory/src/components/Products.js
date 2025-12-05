import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../styles/Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await axios.get("https://localhost:7195/api/Inventory", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch {
            setError("Failed to load products");
        }
    };

    const startEdit = (product) => {
        setEditProduct({
            id: product?.id ?? null,
            name: product?.name ?? "",
            sku: product?.sku ?? "",
            quantity: product?.quantity ?? 0,
            minStock: product?.minStock ?? 0,
            category: product?.category ?? "",
            price: product?.price ?? 0,
        });
        setValidationErrors({});
    };

    const handleEditChange = (field, value, minValue = 0) => {
        if (value < minValue) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: `Please enter a valid ${field} greater than or equal to ${minValue}`,
            }));
        } else {
            setValidationErrors((prev) => {
                const { [field]: removed, ...rest } = prev;
                return rest;
            });
        }
        setEditProduct((prev) => ({ ...prev, [field]: value }));
    };

    const saveProductFromEdit = async () => {
        if (!editProduct.name) {
            alert("Please enter valid details");
            return;
        }
        try {
            const newProd = {
                Name: editProduct.name,
                MinStock: editProduct.minStock,
                Category: editProduct.category,
                Price: editProduct.price,
            };
            await axios.post("https://localhost:7195/api/Inventory", newProd, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditProduct(null);
            alert("Product Added Successfully");
            loadProducts();
        } catch {
            setError("Could not save product");
        }
    };

    const updateProduct = async () => {
        if (Object.keys(validationErrors).length > 0) {
            alert("Please fix validation errors before updating.");
            return;
        }
        try {
            const updatedData = {
                Id: editProduct.id,
                Name: editProduct.name,
                SKU: editProduct.sku,
                Quantity: editProduct.quantity,
                MinStock: editProduct.minStock,
                Category: editProduct.category,
                Price: editProduct.price,
            };
            await axios.put(
                `https://localhost:7195/api/Inventory/${editProduct.id}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditProduct(null);
            loadProducts();
        } catch {
            setError("Could not update product");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`https://localhost:7195/api/Inventory/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            loadProducts();
        } catch {
            setError("Could not delete product");
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            (p.name || p.Name).toLowerCase().includes(search.toLowerCase()) ||
            (p.sku || p.SKU).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="products-container">
            <h2>Inventory Products</h2>

            <input
                type="text"
                className="search-input"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: "20px" }}
            />

            <table className="products-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Min Stock</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name || p.Name}</td>
                                <td>{p.sku || p.SKU}</td>
                                <td>{p.quantity ?? p.Quantity ?? 0}</td>
                                <td>{p.minStock || p.MinStock}</td>
                                <td>{p.category || p.Category}</td>
                                <td>{p.price || p.Price}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => startEdit(p)} aria-label={`Edit ${p.name}`}>
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteProduct(p.id)}
                                        aria-label={`Delete ${p.name}`}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <button className="add-btn" onClick={() => startEdit(null)} aria-label="Add Product">
                <FaPlus /> Add Product
            </button>

            {editProduct !== null && (
                <div className="edit-modal">
                    <div className="edit-box">
                        <h3>{editProduct.id === null ? "Add Product" : "Edit Product"}</h3>
                        <label>Name</label>
                        <input
                            type="text"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                        />
                        {editProduct.id !== null && (
                            <>
                                <label>SKU</label>
                                <input
                                    type="text"
                                    value={editProduct.sku}
                                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                                />
                            </>
                        )}
                        {editProduct.id !== null && (
                            <>
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editProduct.quantity}
                                    onChange={(e) => handleEditChange("quantity", Number(e.target.value), 0)}
                                />
                                {validationErrors.quantity && <p className="error">{validationErrors.quantity}</p>}
                            </>
                        )}
                        <label>Min Stock</label>
                        <input
                            type="number"
                            min="0"
                            value={editProduct.minStock}
                            onChange={(e) => handleEditChange("minStock", Number(e.target.value), 0)}
                        />
                        {validationErrors.minStock && <p className="error">{validationErrors.minStock}</p>}
                        <label>Category</label>
                        <input
                            type="text"
                            value={editProduct.category}
                            onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                        />
                        <label>Price</label>
                        <input
                            type="number"
                            min="1"
                            value={editProduct.price}
                            onChange={(e) => handleEditChange("price", Number(e.target.value), 1)}
                        />
                        {validationErrors.price && <p className="error">{validationErrors.price}</p>}
                        <button
                            onClick={() => {
                                if (editProduct.id === null) {
                                    saveProductFromEdit();
                                } else {
                                    updateProduct();
                                }
                            }}
                            style={{ marginRight: 10 }}
                        >
                            {editProduct.id === null ? "Add" : "Update"}
                        </button>
                        <button className="cancel" onClick={() => setEditProduct(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
