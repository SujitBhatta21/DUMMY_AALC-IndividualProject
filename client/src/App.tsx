import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage.tsx";
import TimelinePage from "./pages/TimelinePage.tsx";
import WhoWeAre from "./pages/WhoWeAre.tsx";
import Settings from "./pages/Settings.tsx";
import ShardPage from "./pages/ShardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { SIZE_MAP } from "./types.ts";

// Wraps any route that requires a logged-in user.
// If no token in localStorage, redirects to /accounts/login.
// So, in backend a token expires at 24 hrs so, this makes sure to send user back to login page.
function ProtectedRoute({ element }: { element: React.ReactElement }) {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/accounts/login" replace />;
}

function App() {
    useEffect(() => {
        const size = localStorage.getItem('aalc-text-size');
        if (size && SIZE_MAP[size]) document.documentElement.style.fontSize = SIZE_MAP[size];

        // Adding accessibility toggle at main App controlled in Settings.
        if (localStorage.getItem('aalc-high-contrast') === 'true') document.body.classList.add('high-contrast');
        if (localStorage.getItem('aalc-reduce-motion') === 'true') document.body.classList.add('reduce-motion');
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/who-we-are" element={<WhoWeAre />} />
                <Route path="/accounts/login" element={<LoginPage />} />

                <Route path="/storyline" element={<ProtectedRoute element={<TimelinePage />} />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/storyline/shard/:id" element={<ProtectedRoute element={<ShardPage />} />} />
            </Routes>
        </Router>
    )
}

export default App
