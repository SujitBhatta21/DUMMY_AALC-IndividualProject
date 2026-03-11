// Components should include all shared components only.
import '../styles/Header.css';
import logo from '../assets/logo/Logo pack AAL 2-12.png'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa"


function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const loggedInUser = localStorage.getItem("username");

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        return () => { document.body.classList.remove('menu-open'); };
    }, [menuOpen]);

    return (
        <>
            <section id='header'>
                <div className='header-text-container'>
                    <Link to={"/"}>
                        <img src={logo} alt="AALC Logo"/>
                    </Link>
                    <div className="header-title">
                        <h3>Anti-Apartheid Legacy Centre <br/> Interactive Anti-Apartheid History Puzzle</h3>
                        {/*<h3>Anti-Apartheid Story</h3>*/}
                    </div>
                    <button
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => { setMenuOpen(!menuOpen); }}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className='desktop-nav'>
                    <ul>
                        <li><Link to='/who-we-are'>Who We Are</Link></li>
                        <li><Link to='/settings'>Settings/Accessibility</Link></li>
                    </ul>
                    { loggedInUser ?
                        <button className="nav-btn" title={loggedInUser}><FaUserCircle className="user-icon"/></button> :
                        <button className="nav-btn"><Link to='/accounts/login'>Sign In</Link></button>
                    }

                </nav>
            </section>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-backdrop ${menuOpen ? 'active' : ''}`}
                onClick={() => { setMenuOpen(false); }}
            >
                <div
                    className={`sidebar ${menuOpen ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <nav className='sidebar-nav'>
                        <ul>
                            <li><Link to='/who-we-are' onClick={() => { setMenuOpen(false); }}>Who We Are</Link></li>
                            <li><Link to='/settings' onClick={() => { setMenuOpen(false); }}>Settings/Accessibility</Link></li>
                        </ul>
                        <button className="nav-btn">
                            <FaUserCircle className="user-icon"/>
                            <p onClick={() => { setMenuOpen(false); }}> { loggedInUser } </p>
                        </button>
                        <button className="">Change Password</button>
                        <button className="logout-btn"><Link to='/'  />Logout</button>
                        {/*onClick={ handleLogoutOperation }*/}
                    </nav>
                </div>
            </div>
        </>
    )
}


export default Header;
export { Header };