import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import "../styles/LoginPage.css";
import { FaRegEye, FaRegEyeSlash, FaRandom } from "react-icons/fa";


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const navigate = useNavigate();

    const fetchRandomUsername = async () => {
        try {
            const res: Response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/generate_username`);
            const data: string = await res.text();
            setUsername(data);
        } catch (err) {
            console.log("Failed to fetch random username", err);
        }
    };

    useEffect(() => {
        if (isRegisterMode) fetchRandomUsername();
        else setUsername(""); // Because username set to disabled during login mode.
    }, [isRegisterMode]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError(await res.text());
                return;
            }

            localStorage.setItem("username", username);
            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.status === 401) {
                setError("Invalid username or password.");
                return;
            }

            localStorage.setItem("username", username);
            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <Header />

            <main className="login-main">
                <div className="login-card">
                    <h1>{isRegisterMode ? "Create Account" : "Welcome Back"}</h1>
                    <p className="login-subtitle">
                        {isRegisterMode ? "Your username has been generated for you" : "Sign in to continue your journey"}
                    </p>

                    <form className="login-form" onSubmit={isRegisterMode ? handleRegister : handleLogin}>
                        {error && <p className="login-error">{error}</p>}

                        <div className="login-field">
                            <label htmlFor="username">Username</label>
                            <div className="password-wrapper">
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value)} }
                                    disabled={isRegisterMode}
                                    required
                                />
                                {isRegisterMode && (
                                    <FaRandom title="Reroll username" onClick={fetchRandomUsername} />
                                )}
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value)} }
                                    required
                                />
                                {showPassword
                                    ? <FaRegEye title="Hide Password" onClick={() => { setShowPassword(false)} } />
                                    : <FaRegEyeSlash title="Show Password" onClick={() => { setShowPassword(true)} } />
                                }
                            </div>
                        </div>

                        <button type="submit" className="login-btn">
                            {isRegisterMode ? "Register" : "Login"}
                        </button>
                    </form>

                    {isRegisterMode && (
                        <p className="privacy-note">
                            We don't collect your name, email, or any personal information. Your username is randomly generated - we never know who you are.
                        </p>
                    )}


                    <div className="login-footer-links">
                        <a  className="mode-change-link" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(""); setPassword(""); }}>
                            {isRegisterMode ? "Already have an account? Login" : "No account? Register here"}
                        </a>

                        <Link to="/">Back to Home</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;