import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage.tsx";
import TimelinePage from "./pages/TimelinePage.tsx";
import WhoWeAre from "./pages/WhoWeAre.tsx";
import Settings from "./pages/Settings.tsx";
import ShardPage from "./pages/ShardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

// Wraps any route that requires a logged-in user.
// If no token in localStorage, redirects to /accounts/login.
// So, in backend a token expires at 24 hrs so, this makes sure to send user back to login page.
function ProtectedRoute({ element }: { element: React.ReactElement }) {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/accounts/login" replace />;
}

function App() {
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
