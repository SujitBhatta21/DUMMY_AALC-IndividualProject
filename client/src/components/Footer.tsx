import '../styles/Footer.css';
import logo from "../assets/logo/Logo pack AAL 2-01.png"
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <img alt={"aalc-footer-logo"} src={logo} />
                <div className="footer-contact">
                    <p>
                        Anti-Apartheid Legacy: <br/><br/>
                        Centre of Memory & Learning<br/><br/>
                        28 Penton Street, Islington<br/><br/>
                    </p>

                    <a href="mailto:info@antiapartheidlegacy.org.uk">
                        info@antiapartheidlegacy.org.uk
                    </a>
                </div>

                <div className="footer-links">
                    <p>Cookie Notice - Not collected</p>
                </div>

                <div className="footer-license">
                    <p>
                        Unless otherwise stated, all content is subject to the following licence:
                    </p>
                    <p>
                        Creative Commons Attribution 4.0 International (CC BY 4.0) <em>Open Licence.</em>
                    </p>
                </div>

                <div className="footer-archival">
                    <p>
                        Archival images appear courtesy of Anti-Apartheid Movement Archives
                        unless otherwise stated
                    </p>
                </div>

                <div className="footer-code-license">
                    <p>
                        Creative Commons 0 1.0 Universal (CC0 1.0) applies to all code and
                        metadata on the website as well as any public domain assets or
                        non-original digital reproductions of public domain assets.
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-copyright">
                    <p>© 2026 Anti Apartheid Legacy.</p>
                </div>
                <div className="footer-social">
                    <a href="https://x.com/pentonstreetcml" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <FaTwitter />
                    </a>
                    <a href="https://www.facebook.com/AntiApartheidLegacy" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebookF />
                    </a>
                    <a href="https://www.linkedin.com/company/the-liliesleaf-trust-uk/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedinIn />
                    </a>
                    <a href="https://www.instagram.com/antiapartheidlegacy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;