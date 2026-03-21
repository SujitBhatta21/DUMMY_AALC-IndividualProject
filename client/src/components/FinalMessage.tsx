import { useState, useEffect } from "react";
import "../styles/FinalMessage.css";
import logo from "../assets/logo/Logo pack AAL 2-01.png";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";


const AALC_WEBSITE = "https://antiapartheidlegacy.org.uk/heritage-arts-culture/history/the-anti-apartheid-centre-of-memory-and-learning/";

const PARAGRAPHS: string[] = [
    "You've done it. All nine shards of history - collected, solved, and pieced together.",
    "The story you've uncovered spans continents and decades. From the townships of South Africa to the streets of London, ordinary people chose solidarity over silence.",
    "History is not just something that happened. It is something that was made — by movements, by sacrifices, and by the quiet courage of people who refused to accept the world as it was.",
    "The legacy of that struggle lives on. And now, so does your understanding of it.",
];

interface FinalMessageProps {
    onBack: () => void;
}

function FinalMessage({ onBack }: FinalMessageProps) {
    const [visibleCount, setVisibleCount] = useState(0);

    // Scroll to top so the logo/hero is the first thing seen
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const timers = PARAGRAPHS.map((_, i) =>
            setTimeout(() => { setVisibleCount(i + 1) }, 600 + i * 1400)
        );
        return () => { timers.forEach(clearTimeout); }
    }, []);

    const reflectionVisible = visibleCount >= PARAGRAPHS.length;

    return (

        <div className="final-message">

            {/* Crossfire confetti preset — runs automatically on mount */}
            <Crossfire autorun={{ speed: 15 }} />

            <section className="final-hero">
                <img src={logo} alt="Anti-Apartheid Legacy Centre logo" className="final-logo" />
                <h1 className="final-heading">Congratulations</h1>
                <p className="final-subheading">You have completed the Interactive Anti-Apartheid History Puzzle</p>
            </section>

            <section className="final-paragraphs">
                {PARAGRAPHS.map((text, i) => (
                    <p
                        key={i}
                        className={`final-para ${i < visibleCount ? "final-para--visible" : ""}`}
                    >
                        {text}
                    </p>
                ))}
            </section>

            <div className={`final-reflection ${reflectionVisible ? "final-reflection--visible" : ""}`}>
                <hr className="final-divider" />

                <p className="final-reflection-intro">Before you go — something to think about:</p>

                <div className="reflection-cards">
                    <article className="reflection-card">
                        <p>What combinations of forces (local, international, personal) do you think were essential in ending apartheid?</p>
                    </article>
                    <article className="reflection-card">
                        <p>Which part of this story resonated with you the most, and why?</p>
                    </article>
                </div>

                <article className="reflection-card reflection-card--bonus">
                    <span className="bonus-label">Bonus question</span>
                    <p>Why do you think there are 9 shards?</p>
                </article>

                <div className="final-actions">
                    <a
                        href={AALC_WEBSITE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="final-cta-btn"
                    >
                        Visit the Anti-Apartheid Legacy Centre
                    </a>
                    <button className="final-back-btn" onClick={onBack}>
                        Back to Home
                    </button>
                </div>
            </div>

        </div>
    );
}

export default FinalMessage;