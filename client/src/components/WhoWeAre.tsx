import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import logo from "../assets/logo/Logo pack AAL 2-01.png"
import "../styles/WhoWeAre.css"


function WhoWeAre(){
    const cmlLink = "https://antiapartheidlegacy.org.uk/heritage-arts-culture/history/the-anti-apartheid-centre-of-memory-and-learning/";

    function handleOnClick() {
        window.location.href = cmlLink;
    }
    
    return(
        <div className="who-we-are-page">
            <Header />

            <section className="who-we-are-hero">
                <h1>Who We Are</h1>
                <p className="hero-subtitle">
                    Preserving the legacy of the anti-apartheid struggle and empowering communities through education, arts and culture.
                </p>
            </section>

            <section className="green-box-container">
                <div className="img-readmore-section">
                    <img src={ logo } alt="AALC Logo" />
                    <button onClick={ handleOnClick }>Visit Our Website</button>
                </div>
                <div className="text-container">
                    <p>
                        Opening soon as a permanent home for our thriving programme, The Anti-Apartheid Legacy:
                        Centre of Memory and Learning will promote the legacy and values of the Southern African
                        liberation struggle and engage the UK's central role within this world-changing history,
                        whilst supporting contemporary discourse around social (in)justice, inclusion, anti-racism
                        and collaboration for social transformation, empowering communities today and tomorrow.
                    </p>
                    <p>
                        A hub for our arts, cultural and educational programming, visitors will access the Centre's
                        permanent exhibition and a rotation of content in the temporary gallery, a community
                        learning garden, seminar spaces and an archive reading room.
                    </p>
                    <p>
                        We invite you to learn about, and from, the legacy of the anti-apartheid struggle and the
                        dynamic cultural heritage of Southern Africa.
                    </p>
                </div>
            </section>

            <section className="mission-section">
                <h2>Our Mission</h2>
                <p>
                    The Anti-Apartheid Legacy Centre is dedicated to preserving and sharing the history of
                    the anti-apartheid movement. We aim to educate, inspire and empower individuals and
                    communities by connecting the lessons of the past to the social justice challenges of today.
                </p>
                <p>
                    Through exhibitions, educational programmes and community engagement, we foster
                    understanding of how collective action can drive meaningful change in society.
                </p>
            </section>

            <section className="what-we-offer-section">
                <h2>What We Offer</h2>
                <div className="offer-cards">
                    <div className="offer-card">
                        <h3>About Us</h3>
                        <p>Information about The Liliesleaf Trust UK’s aims and values, our staff, board and advisory group</p>
                    </div>
                    <div className="offer-card">
                        <h3>Heritage, Arts & Culture</h3>
                        <p>Collections, Exhibitions and Artists’ Commissions as well as contemporary socio- cultural responses to the heritage of the movement against apartheid.</p>
                    </div>
                    <div className="offer-card">
                        <h3>Programme</h3>
                        <p>Learning opportunities for schools, young people and communities including heritage talks, special events and more</p>
                    </div>
                    <div className="offer-card">
                        <h3>Centre of Memory and Learning</h3>
                        <p>The Anti-Apartheid Legacy: Centre of Memory and Learning at 28 Penton Street and the parallel digital offer</p>
                    </div>
                    <div className="offer-card">
                        <h3>Blogs</h3>
                        <p>Visit our blog section to learn more about our collaborations, launches, activities and more.</p>
                    </div>
                    <div className="offer-card">
                        <h3>Get Involved</h3>
                        <p>Find our contact information and ways to get involved in our work (e.g. volunteering, collaborations or partnerships)</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default WhoWeAre;