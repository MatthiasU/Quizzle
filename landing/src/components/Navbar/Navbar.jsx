import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faBars, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from "react";
import "./styles.sass";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                    <img src="/quizzle-logo.png" alt="Quizzle"/>
                    <span>Quizzle</span>
                </NavLink>

                <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars}/>
                </button>

                <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                    <NavLink to="/" end onClick={() => setMenuOpen(false)}>Startseite</NavLink>
                    <NavLink to="/funktionen" onClick={() => setMenuOpen(false)}>Funktionen</NavLink>
                    <NavLink to="/installation" onClick={() => setMenuOpen(false)}>Installation</NavLink>
                    <a href="https://github.com/gnmyt/Quizzle" target="_blank" rel="noopener noreferrer"
                       className="navbar-github" onClick={() => setMenuOpen(false)}>
                        <FontAwesomeIcon icon={faGithub}/>
                        GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
};
