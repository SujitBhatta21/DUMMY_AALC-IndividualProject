import '../App.css'
import { Header } from "../components/Header.tsx";

function TimelinePage() {
    return (
        <div className="timeline-page">
            <Header />
            <section className="timeline-section">
                <h1>Timeline</h1>
                <p>This is where my timeline content will be.</p>
            </section>
        </div>
    )
}

export default TimelinePage;
