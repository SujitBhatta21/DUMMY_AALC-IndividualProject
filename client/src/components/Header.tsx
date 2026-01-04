// Components should include all shared components only.
import './Header.css';
import logo from '../assets/Logo pack AAL 2-12.png'
import { useState, useEffect } from 'react';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <img src={logo} alt="AALC Logo"/>
                    <div className="header-title">
                        <h3>AALC Interactive</h3>
                        <h3>Anti-Apartheid Story</h3>
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
                        <li><a href='#'>Who We Are</a></li>
                        <li><a href='#'>Museum</a></li>
                        <li><a href='#'>Settings/Accessibility</a></li>
                    </ul>
                    <button className="shard-btn"><a href='#'>Shard Collection</a></button>
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
                            <li><a href='#'>Who We Are</a></li>
                            <li><a href='#'>Museum</a></li>
                            <li><a href='#'>Settings/Accessibility</a></li>
                        </ul>
                        <button className="shard-btn"><a href='#'>Shard Collection</a></button>
                    </nav>
                </div>
            </div>
        </>
    )
}


export {Header}