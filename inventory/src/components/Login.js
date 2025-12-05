import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://localhost:7195/api/Auth/login", {
                username,
                password,
            });

            const userRole = response.data.role.toLowerCase();

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            if (userRole === "admin") {
                navigate("/admin/products");
            } else if (userRole === "staff") {
                navigate("/staff/products");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Login failed");
            } else {
                setError("Network or server error");
            }
        }
    };

    return (
        <div className="login-page">
            <div
                className="login-left"
                style={{ backgroundImage: `url('/inventory-bg.png')` }}
            ></div>
            <div className="login-right">
                <div className="login-card">
                    <img
                        src="/WinWireLogo 1.png"
                        alt="WinWire"
                        className="winwire-logo"
                    />

                    <h2>Inview Login</h2>

                    <form onSubmit={submit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                        {error && <p className="error">{error}</p>}
                    </form>

                    <p className="register-link">
                        New user?{" "}
                        <span onClick={() => (window.location.href = "/register")}>
                            Create an account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
