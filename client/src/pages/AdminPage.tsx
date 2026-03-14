import { useState, useEffect } from "react";

import "../styles/AdminPage.css";
import {
    FiGrid, FiUsers, FiBarChart2
} from "react-icons/fi";
import {apiFetch} from "../utils.ts";

type Panel = "dashboard" | "users" | "reports";

const NAVIGATION_OPTIONS: { id: Panel; label: string; icon: JSX.Element }[] = [
    { id: "dashboard", label: "Dashboard",  icon: <FiGrid /> },
    { id: "users",     label: "Users",       icon: <FiUsers /> },
    { id: "reports",   label: "Reports",     icon: <FiBarChart2 /> },
];


// Dashboard on the left which is styled horizontal.
function DashboardPanel() {
    const [totalUsers, setTotalUsers] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStats() {
            const res = await apiFetch("/api/accounts/admin/total_users");
            if (res.ok) setTotalUsers(await res.json());
        }
        fetchStats();
    }, []);

    const stats = [
        { label: "Total Users",      value: totalUsers !== null ? String(totalUsers) : "—", delta: "" },
        { label: "Active Today",     value: "—", delta: "" },
        { label: "Shards Completed", value: "—", delta: "" },
        { label: "Puzzles Solved",   value: "—", delta: "" },
    ];

    const recentActivity = [
        { text: "New user registered", time: "just now" },
        { text: "Shard #4 completed by user", time: "2 min ago" },
        { text: "Puzzle solved — Shard #2", time: "10 min ago" },
        { text: "New user registered", time: "18 min ago" },
        { text: "Shard #1 completed by user", time: "32 min ago" },
    ];

    const shardProgress = [
        { label: "Shard 1 — Introduction", percentage: 80 },
        { label: "Shard 2 — The March", percentage: 55 },
        { label: "Shard 3 — Resistance", percentage: 40 },
        { label: "Shard 4 — Freedom", percentage: 20 },
    ];

    return (
        <>
            <h1>Dashboard</h1>
            <p className="admin-subtitle">Overview of platform activity</p>

            <div className="stat-cards">
                {stats.map(s => (
                    <div className="stat-card" key={s.label}>
                        <span className="stat-label">{s.label}</span>
                        <span className="stat-value">{s.value}</span>
                        {s.delta && <span className="stat-delta">{s.delta}</span>}
                    </div>
                ))}
            </div>

            <div className="admin-panels">
                <div className="admin-panel">
                    <h3 className="admin-section-title">Recent Activity</h3>
                    <div className="activity-list">
                        {recentActivity.map((item, i) => (
                            <div className="activity-item" key={i}>
                                <span className="activity-dot" />
                                {item.text}
                                <span className="activity-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-panel">
                    <h3 className="admin-section-title">Shard Completion Rate</h3>
                    <div className="progress-list">
                        {shardProgress.map(s => (
                            <div className="progress-row" key={s.label}>
                                <div className="progress-row-header">
                                    <span>{s.label}</span>
                                    <span>{s.percentage}%</span>
                                </div>
                                <div className="progress-bar-track">
                                    <div className="progress-bar-fill" style={{ width: `${s.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function PlaceholderPanel({ title }: { title: string }) {
    return (
        <section>
            <h1>{title}</h1>
            <p className="admin-subtitle">This section is under construction.</p>
            <div className="admin-panel" style={{ marginTop: "1rem" }}>
                <p style={{ color: "#888", textAlign: "center", padding: "3rem 0" }}>
                    Content coming soon...
                </p>
            </div>
        </section>
    );
}


// Main AdminPage function
function AdminPage() {
    const [activePanel, setActivePanel] = useState<Panel>("dashboard");

    useEffect(() => {
        document.title = "Admin | AALC Interactive";
    }, []);

    const renderPanel = () => {
        switch (activePanel) {
            case "dashboard": return <DashboardPanel />;
            case "users":     return <PlaceholderPanel title="Users" />;
            case "reports":   return <PlaceholderPanel title="Reports & Analytics" />;
        }
    };

    return (
        <div className="home-page">

            {/* Header already in Homepage Before calling AdminPage. */}

            <div className="admin-layout">
                <nav className="admin-sidebar">
                    <h1>Admin Panel</h1>
                    {NAVIGATION_OPTIONS.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-item ${activePanel === item.id ? "active" : ""}`}
                            onClick={() => { setActivePanel(item.id)} }
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <main className="admin-main">
                    {renderPanel()}
                </main>
            </div>

        </div>
    );
}

export default AdminPage;