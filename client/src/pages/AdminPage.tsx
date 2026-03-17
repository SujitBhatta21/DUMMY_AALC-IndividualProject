import React, { useState, useEffect } from "react";
import "../styles/AdminPage.css";
import { FiGrid, FiUsers, FiBarChart2 } from "react-icons/fi";
import {apiFetch} from "../utils.ts";
import type { IReport, IUser } from "../types.ts";


type Panel = "dashboard" | "users" | "reports";

const NAVIGATION_OPTIONS: { id: Panel; label: string; icon: JSX.Element }[] = [
    { id: "dashboard", label: "Dashboard",  icon: <FiGrid /> },
    { id: "users",     label: "Users",       icon: <FiUsers /> },
    { id: "reports",   label: "Report / Issue",     icon: <FiBarChart2 /> },
];

interface IShardProgressCompletionRate {
    id: number;
    title: string; // Shard title.
    percentage: number;
}


// Dashboard on the left which is styled horizontal.
function DashboardPanel() {
    const [totalUsers, setTotalUsers] = useState<number[]>([]);
    const [totalActiveToday, setTotalActiveToday] = useState<number | null>(null);
    const [totalShardsCompleted, setTotalShardsCompleted] = useState<number | null>(null);
    const [totalAllPSolved, setTotalAllPSolved] = useState<number | null>(null);

    const [shardCompletionRate, setShardCompletionRate] = useState<IShardProgressCompletionRate[]>([]);

    useEffect(() => {
        async function fetchStats() {
            const [
                tUsersRes, tActiveTodayRes, tShardsCompletedRes, tAllPSolved, tCompletionRate
            ] = await Promise.all([
                apiFetch("/api/accounts/admin/total_users"),
                apiFetch("/api/accounts/admin/active_today"),
                apiFetch("/api/accounts/admin/shards_completed"),
                apiFetch("/api/accounts/admin/total_all_puzzle_solved"),
                apiFetch("/api/accounts/admin/shard_completion_rate")
            ])

            if (tUsersRes.ok) setTotalUsers(await tUsersRes.json());
            if (tActiveTodayRes.ok) setTotalActiveToday(await tActiveTodayRes.json());
            if (tShardsCompletedRes.ok) setTotalShardsCompleted(await tShardsCompletedRes.json());
            if (tAllPSolved.ok) setTotalAllPSolved(await tAllPSolved.json());
            if (tCompletionRate.ok) setShardCompletionRate(await tCompletionRate.json());
        }
        fetchStats();
    }, []);

    useEffect(() => {
        console.log("Shard Completion Rate: ", shardCompletionRate);
    }, [shardCompletionRate]);

    const stats = [
        { label: "Total Users",       value: totalUsers.length != 0 ? String(totalUsers.at(0)) : "-", subValue: totalUsers.length != 0 ? `${totalUsers.at(1)} Admin · ${totalUsers.at(2)} User` : "" },
        { label: "Active Today",      value: totalActiveToday != null ? String(totalActiveToday) : "-" },
        { label: "Shards Completed",  value: totalShardsCompleted !== null ? String(totalShardsCompleted) : "-" },
        { label: "All Puzzles Solved", value: totalAllPSolved !== null ? String(totalAllPSolved) : "-" },
    ];

    const recentActivity = [
        { text: "New user registered", time: "just now" },
        { text: "Shard #4 completed by user", time: "2 min ago" },
        { text: "Puzzle solved — Shard #2", time: "10 min ago" },
        { text: "New user registered", time: "18 min ago" },
        { text: "Shard #1 completed by user", time: "32 min ago" },
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
                        {s.subValue && <span className="stat-subvalue">{s.subValue}</span>}
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
                        {shardCompletionRate.map(s => (
                            <div className="progress-row" key={s.title}>
                                <div className="progress-row-header">
                                    <span>Shard-{s.id}: {s.title}</span>
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

function UserPanel() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [searchTermUsername, setSearchTermUsername] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            const res = await apiFetch("/api/accounts/admin/users");
            if (res.ok) setUsers(await res.json());
        }
        fetchUsers();
    }, []);

    const handleDeleteUser = async () => {
        if (deleteTargetId === null) return;
        const res = await apiFetch(`/api/accounts/admin/users/${deleteTargetId}`, { method: "DELETE" });
        if (res.ok) {
            setUsers(prev => prev.filter(u => u.userId !== deleteTargetId));
            setDeleteTargetId(null);
        }
    };

    const filteredUsers = users
        .filter(u => u.username.toLowerCase().includes(searchTermUsername.toLowerCase()))
        .filter(u => roleFilter === "ALL" || u.role === roleFilter);

    const deleteTarget = users.find(u => u.userId === deleteTargetId);

    return (
        <section>
            <h1>Users</h1>
            <p className="admin-subtitle">All registered users on the platform</p>

            <div className="user-filter-bar">
                <input
                    type="text"
                    placeholder="Search by username..."
                    aria-label="Search by username"
                    value={searchTermUsername}
                    onChange={e => { setSearchTermUsername(e.target.value)} }
                    className="user-filter-input"
                />
                <select
                    value={roleFilter}
                    onChange={e => { setRoleFilter(e.target.value)} }
                    className="user-filter-select"
                    aria-label="Filter by role"
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
            </div>

            <div className="panel-list">
                {filteredUsers.length === 0 && (
                    <p className="empty-state">No users found.</p>
                )}
                {filteredUsers.map(user => (
                    <div className="info-card" key={user.userId}>
                        <div className="card-header">
                            <span className="card-title">{user.username}</span>
                            <span className={`badge ${user.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                                {user.role}
                            </span>
                            <button
                                className="admin-delete-btn"
                                onClick={() => setDeleteTargetId(user.userId)}
                            >
                                Delete
                            </button>
                        </div>
                        <p className="card-meta">ID: {user.userId}</p>
                        <p className="card-meta">
                            Last active: {user.lastActiveAt
                                ? new Date(user.lastActiveAt).toLocaleString()
                                : "Never"}
                        </p>
                    </div>
                ))}
            </div>

            {deleteTargetId !== null && (
                <div className="confirm-overlay" onClick={() => { setDeleteTargetId(null)} }>
                    <div className="confirm-dialog" onClick={e => { e.stopPropagation()} }>
                        <h2>Delete user?</h2>
                        <p>
                            This will permanently delete <strong>{deleteTarget?.username}</strong> and all
                            their data. This cannot be undone.
                        </p>
                        <div className="confirm-actions">
                            <button className="admin-btn-outline" onClick={() => { setDeleteTargetId(null)} }>
                                Cancel
                            </button>
                            <button className="admin-btn-danger" onClick={handleDeleteUser}>
                                Yes, delete user
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

interface ReportsPanelProps {
    reports: IReport[];
    setReports: React.Dispatch<React.SetStateAction<IReport[]>>;
}

function ReportsPanel({ reports, setReports }: ReportsPanelProps) {
    const [postError, setPostError] = useState<string>("");

    const handleStatusChange = async (id: number, newStatus: IReport["status"]) => {
        // TODO: PATCH /api/accounts/admin/reports/{id}/status
        try {
            const res = await apiFetch(`/api/accounts/admin/reports/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify(newStatus),
            });

            if (!res.ok) {
                setPostError(await res.text());
                return;
            }

        } catch (e) {
            console.error("Error: ", e);
        }

        // Changing the jsx for state status.
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    return (
        <section>
            <h1>Reports & Issues</h1>
            <p className="admin-subtitle">Submitted reports from users</p>
            <div className="panel-list">
                {reports.length === 0 && (
                    <p className="empty-state">No reports found.</p>
                )}
                {reports.map(report => (
                    <div className="info-card" key={report.id}>
                        <div className="card-header">
                            <span className="card-title">{report.title}</span>
                            <span className="card-date">
                                Date Issued (Time) :
                                {` ${new Date(report.createdAt).toLocaleDateString()}`}
                                {` (${new Date(report.createdAt).toLocaleTimeString()})`}
                            </span>
                        </div>
                        <p className="card-meta">By: {report.user.username}</p>
                        <p className="card-description">{report.description}</p>
                        <div className="card-footer">
                            <span className="card-footer-label">Status:</span>
                            <select
                                value={report.status}
                                onChange={(e) => { handleStatusChange(report.id, e.target.value as IReport["status"])} }
                            >
                                <option value="OPEN">Open</option>
                                <option value="IN_REVIEW">In Review</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


// Main AdminPage function
function AdminPage() {
    const [activePanel, setActivePanel] = useState<Panel>("dashboard");
    const [reports, setReports] = useState<IReport[]>([]);

    useEffect(() => {
        document.title = "Admin | AALC Interactive";
        async function fetchReports() {
            const res = await apiFetch("/api/accounts/admin/reports");
            if (res.ok) setReports(await res.json());
        }
        fetchReports();
    }, []);

    const openReportsCount = reports.filter(r => r.status === "OPEN").length;

    const renderPanel = () => {
        switch (activePanel) {
            case "dashboard": return <DashboardPanel />;
            case "users":     return <UserPanel />;
            case "reports":   return <ReportsPanel reports={reports} setReports={setReports} />;
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
                            {item.id === "reports" && openReportsCount > 0 && (
                                <span className="notification-badge">{openReportsCount}</span>
                            )}
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