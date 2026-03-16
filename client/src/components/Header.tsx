// Components should include all shared components only.
import '../styles/Header.css';
import logo from '../assets/logo/Logo pack AAL 2-12.png'
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa"
import ReportForm from './ReportForm.tsx';


function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [reportFormOpen, setReportFormOpen] = useState(false);
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

    const handleLogoutOperation = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setMenuOpen(false);
        window.location.href = "/";
    }


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
                        <li><Link to="/">Home</Link></li>
                        <li><Link to='/who-we-are'>Who We Are</Link></li>
                        <li><Link to='/settings'>Settings/Accessibility</Link></li>
                    </ul>
                    { loggedInUser ?
                        <div className="user-dropdown-wrapper">
                            <button className="nav-btn" onClick={() => { setDropdownOpen(!dropdownOpen)} }>
                                <FaUserCircle className="user-icon"/>
                            </button>
                            {dropdownOpen && (
                                <>
                                    <div className="dropdown-backdrop" onClick={() => { setDropdownOpen(false)} } />
                                    <div className="user-dropdown">
                                        <span className="dropdown-username">{loggedInUser}</span>
                                        { localStorage.getItem("role") === "USER" &&
                                            <button className="dropdown-report"
                                                    onClick={() => { setDropdownOpen(false); setReportFormOpen(true); }}>Report Issue</button>
                                        }
                                        <button className="dropdown-logout" onClick={handleLogoutOperation}>Logout</button>
                                    </div>
                                </>
                            )}
                        </div> :
                        <Link className="nav-btn" to='/accounts/login'>Sign In</Link>
                    }

                </nav>
            </section>

            {reportFormOpen && <ReportForm onClose={() => { setReportFormOpen(false)} } />}

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
                            <li><Link to="/" onClick={() => { setMenuOpen(false); }}>Home</Link></li>
                            <li><Link to='/who-we-are' onClick={() => { setMenuOpen(false); }}>Who We Are</Link></li>
                            <li><Link to='/settings' onClick={() => { setMenuOpen(false); }}>Settings/Accessibility</Link></li>
                        </ul>

                        {!loggedInUser &&
                            <button className="nav-btn" onClick={() => { setMenuOpen(false); }}><Link to='/accounts/login'>Sign In</Link></button>
                        }
                        {loggedInUser &&
                            <>
                                <button className="nav-btn">
                                    <FaUserCircle className="user-icon"/>
                                    <p onClick={() => { setMenuOpen(false); }}> { loggedInUser } </p>
                                </button>
                                <button className="">Change Password</button>
                                <button className="logout-btn" onClick={ handleLogoutOperation }><Link to='/'  />Logout</button>
                            </>
                        }

                    </nav>
                </div>
            </div>
        </>
    )
}


export default Header;
export { Header };