// import { Header } from "../components/Header";
import '../App.css'
import {Header} from "../components/Header.tsx";

function HomePage() {
    return (
        <div className="home-page">
            <Header />

            <div className="testing-contents">
                <div className="box">1</div>
                <div className="box">2</div>
            </div>

            <section className="home-section">
                <div className="section-content">
                    <h1>Welcome To the Homepage</h1>
                    <p>Build something amazing with React and TypeScript</p>
                    <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    )
}


export default HomePage;