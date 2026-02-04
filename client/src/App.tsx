import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage.tsx";
import TimelinePage from "./pages/TimelinePage.tsx";
import WhoWeAre from "./components/WhoWeAre.tsx";
import Museum from "./components/Museum";
import Settings from "./components/Settings.tsx";
import ShardPage from "./pages/ShardPage.tsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/storyline" element={(<TimelinePage />)} />
                <Route path="/who-we-are" element={<WhoWeAre />} />
                <Route path="/museum" element={<Museum />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/storyline/shard/:id" element={<ShardPage />}/>
            </Routes>
        </Router>
    )
}

export default App
