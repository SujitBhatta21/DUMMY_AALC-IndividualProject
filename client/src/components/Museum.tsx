import Header from "./Header.tsx";
import "../App.css"
import Footer from "./Footer.tsx";


function Museum() {
    return (
        <div className="Museum-page">
            <Header />
            <div className="museum-container">
                <div className="google-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.9490912123033!2d-0.11373392352017855!3d51.532493571818925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b43dbafc353%3A0x65bde35c2726734b!2s28%20Penton%20St%2C%20London%20N1%209PW!5e0!3m2!1sen!2suk!4v1769377223058!5m2!1sen!2suk"
                        width="600"
                        height="450"
                        style={{border: 0}}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
                <div className="museum-contents">
                    <h1>ADDRESS</h1>
                    <p>28 Penton Street, London, N1 9PW</p>
                    <h1>OPENING HOURS</h1>
                    <ul>
                        <li>Monday-Friday (....)</li>
                        <li>Saturday (....)</li>
                        <li>Sunday Closed</li>
                    </ul>
                    <h1>CONTACT</h1>
                    <h2>(+44) ...</h2>

                </div>
            </div>
            <Footer />
        </div>
    );
}


export default Museum;