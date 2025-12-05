import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Products.css";

function ProductsStaff() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [editProduct, setEditProduct] = useState(null);
    const [error, setError] = useState("");

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
        } catch (err) {
            setError("Failed to load products");
        }
    };
    const startEdit = (product) => {
        setEditProduct({
            id: product.id,
            name: product.name || product.Name,
            sku: product.sku || product.SKU,
            quantity: product.quantity || product.Quantity,
            minStock: product.minStock || product.MinStock,
            category: product.category || product.Category,
            price: product.price || product.Price,
        });
    };

    const updateProduct = async () => {
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
        } catch (err) {
            setError("Could not update product");
        }
    };


    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="products-container">
            <h2>Inventory Products</h2>

            {error && <p className="error">{error}</p>}

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
                        <th>Quantity</th>
                        <th>SKU</th>
                        <th>Min Stock</th>
                        <th>Category</th>
                        <th>Price</th>
                        {/* <th>Edit</th> */}
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
                                <td>{p.name}</td>
                                <td>{p.quantity}</td>
                                <td>{p.sku}</td>
                                <td>{p.minStock}</td>
                                <td>{p.category}</td>
                                <td>{p.price}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editProduct && (
                <div className="edit-modal">
                    <div className="edit-box">
                        <h3>Edit Product</h3>

                        <input
                            type="text"
                            value={editProduct.name}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            value={editProduct.sku}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, sku: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            value={editProduct.quantity}
                            onChange={(e) =>
                                setEditProduct({
                                    ...editProduct,
                                    quantity: Number(e.target.value),
                                })
                            }
                        />
                        <input
                            type="number"
                            value={editProduct.minStock}
                            onChange={(e) =>
                                setEditProduct({
                                    ...editProduct,
                                    minStock: Number(e.target.value),
                                })
                            }
                        />
                        <input
                            type="text"
                            value={editProduct.category}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, category: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            value={editProduct.price}
                            onChange={(e) =>
                                setEditProduct({
                                    ...editProduct,
                                    price: Number(e.target.value),
                                })
                            }
                        />

                        <button onClick={updateProduct}>Update</button>
                        <button className="cancel" onClick={() => setEditProduct(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsStaff;
