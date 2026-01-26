import '../App.css'
import "../styles/HomePage.css"
import { Header } from "../components/Header.tsx";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import anc_logo from "../assets/ancplaque-copy-2.jpg"
import AALC_Design from "../assets/DesignForAALC_Museum.jpg"

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <Header />

            <section className="home-section">
                <div className="home-top-container">
                    <h1>"Rebuild the Story, Piece together the struggle"</h1>

                    {/* void inside navigate cause of strict TS "I know it's a promise but don't wait for it to finish"*/}
                    <button onClick={() => { void navigate("/timeline"); }}>
                        Start Experience
                    </button>
                </div>
                <div className="home-middle-container">
                    {/*  ADD IMAGEes and TEXT in this container  */}
                    <img id="anc_logo_img" alt="anc_logo" src={ anc_logo }/>
                    <div className="aalc_design_logo">
                        <img id="aalc_design_img" alt="aalc_design" src={ AALC_Design }/>
                        <p>Home-middle-container : Contains images</p>
                    </div>
                </div>
                <div className="home-bottom-container">
                    {/*  Add What we believe in this container  */}
                    <h2><b>WHAT WE <br/>BELIEVE </b></h2>
                    <div className="We-believe-text-container ">

                        <p>
                            We believe learning comes from experiencing via interacting. <br/><br/>
                            The project is dedicated to someone who is not familiar with the apartheid regime, serving as
                            an introduction to its cruelty, struggles, and triumphs in an interactive format, inspiring
                            users to delve deeper into this dark phase of South African history.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}


export default HomePage;