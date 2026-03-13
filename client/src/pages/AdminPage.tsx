import '../App.css'
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import { useEffect } from "react";

function AdminPage() {
    useEffect(() => {
        document.title = 'Admin | AALC Interactive';
    }, []);

    return (
        <div className="home-page">
            <Header />

            <section className="home-section">
                <div className="home-top-container">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, Admin. Manage the application here.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default AdminPage;