import { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    // Default role for new users
    const role = "staff";

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await axios.post("https://localhost:7195/api/Auth/register", {
                Username: username,
                Password: password,
                Role: role,
            });

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Registration failed");
            } else {
                setError("Network or server error");
            }
        }
    };

    return (
        <div className="register-page">
            <div
                className="register-left"
                style={{
                    backgroundImage: `url('/inventory-bg.png')`
                }}
            ></div>

            <div className="register-right">
                <div className="register-card">
                    <h2>Create Account</h2>

                    <form onSubmit={submit}>
                        <input type="hidden" value="staff" />
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

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Register</button>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </form>

                    <p className="login-link">
                        Already have an account?{" "}
                        <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
