import '../App.css'
import "../styles/HomePage.css"
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import {Link} from "react-router-dom";
import kids_puzzle_image from "../assets/Close_up_of_Hand_Cut_Jigsaw_Puzzle.jpeg"

function HomePage() {
    return (
        <div className="home-page">
            <Header />

            <section className="home-section">
                <div className="home-top-container">
                    <h1>"Rebuild the Story, Piece together the struggle"</h1>
                    <Link to="/storyline">
                        <button>Start Puzzle Experience</button>
                    </Link>
                </div>

                <div className="home-middle-container">
                    <img id="anc_logo_img" alt="Kids solving a jigsaw puzzle" src={ kids_puzzle_image }/>
                    <div className="puzzle-about-content">
                        <h2>What is this?</h2>
                        <p>
                            Solve puzzles. Collect shards. Uncover history.
                        </p>
                        <p>
                            Each shard reveals a piece of the real story of apartheid
                            in South Africa and the people who fought against it —
                            right here from London's 28 Penton Street.
                        </p>
                        <p className="age-note">Designed for learners aged 10–14</p>
                    </div>
                </div>

                <div className="home-bottom-container">
                    <h2>What We Believe</h2>
                    <p>
                        We believe learning comes from experiencing via interacting. <br/><br/>
                        The project is dedicated to someone who is not familiar with the apartheid regime, serving as
                        an introduction to its cruelty, struggles, and triumphs in an interactive format, inspiring
                        users to delve deeper into this dark phase of African history not only in South Africa.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    )
}


export default HomePage;
