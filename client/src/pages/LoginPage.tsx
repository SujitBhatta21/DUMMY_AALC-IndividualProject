import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import "../styles/LoginPage.css";
import { FaRegEye, FaRegEyeSlash, FaRandom } from "react-icons/fa";
import { apiFetch } from "../utils.ts"


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const fetchRandomUsername = async () => {
        try {
            const res: Response = await apiFetch("/api/accounts/generate_username");
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
            const res = await apiFetch("/api/accounts/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError(await res.text());
                return;
            }

            // Register returns a success message — switch to login so user can sign in
            setIsRegisterMode(false);
            setPassword("");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await apiFetch("/api/accounts/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError("Invalid username or password.");
                return;
            }

            // Store token + identity — token is sent automatically by apiFetch on every request
            const data = await res.json() as { token: string; userId: number; username: string; role: string };
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", String(data.userId));
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);
            window.location.href = "/"; // Just useNavigate doesn't work. I need to reload the page for UI changes as well.

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <Header />

            <main className="login-main">
                <div className="login-notice">
                    <strong>Notice:</strong> The backend is hosted on Render's free tier and may take 30–120 seconds to respond on first request. Please be patient after submitting.
                </div>
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
                                    <button type="button" className="icon-btn" aria-label="Reroll username" onClick={fetchRandomUsername}>
                                        <FaRandom />
                                    </button>
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
                                <button
                                    type="button"
                                    className="icon-btn"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => { setShowPassword(!showPassword); }}
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn">
                            {isRegisterMode ? "Register" : "Login"}
                        </button>
                    </form>

                    <p className="privacy-note">
                        A login is required to save your progress.
                    </p>

                    {isRegisterMode && (
                        <p className="privacy-note">
                            Your username is randomly generated and your password is securely hashed — we never store personal information.
                        </p>
                    )}


                    <div className="login-footer-links">
                        <button type="button" className="mode-change-link" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(""); setPassword(""); }}>
                            {isRegisterMode ? "Already have an account? Login" : "No account? Register here"}
                        </button>

                        <Link to="/">Back to Home</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LoginPage;