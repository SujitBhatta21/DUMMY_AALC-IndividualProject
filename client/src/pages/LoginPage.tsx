import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import "../styles/LoginPage.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent)=> {
        e.preventDefault();
        setError("");

        // TODO: replace with real API call
        if (username === "" || password === "") {
            setError("Please fill in all fields.");
            return;
        }

        navigate("/");
    }

    return (
        <div className="login-page">
            <Header />

            <main className="login-main">
                <div className="login-card">
                    <h1>Welcome Back</h1>
                    <p className="login-subtitle">Sign in to continue your journey</p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <p className="login-error">{error}</p>}

                        <div className="login-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value)} }
                                required
                            />
                        </div>

                        <div className="login-field">

                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper"> {/* For the eye icon inside password input field. */}
                                <input
                                    id="password"
                                    type={ showPassword ? "text" : "password" }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value)} }
                                    required
                                />

                                { showPassword ?
                                    <FaRegEye onClick={ () => { setShowPassword(false) }}/> :
                                    <FaRegEyeSlash onClick={ () => { setShowPassword(true) }}/>
                                }
                            </div>
                        </div>

                        <button type="submit" className="login-btn">Login</button>
                    </form>

                    <div className="login-footer-links">
                        <Link to="/">Back to Home</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;