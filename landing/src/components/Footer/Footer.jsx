import {Link} from "react-router-dom";
import "./styles.sass";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <img src="/quizzle-logo.png" alt="Quizzle" className="footer-logo"/>
                    <span>Quizzle</span>
                </div>
                <div className="footer-links">
                    <Link to="/">Startseite</Link>
                    <Link to="/funktionen">Funktionen</Link>
                    <Link to="/installation">Installation</Link>
                    <a href="https://github.com/gnmyt/Quizzle" target="_blank"
                       rel="noopener noreferrer">GitHub</a>
                    <a href="https://gnm.dev/imprint" target="_blank"
                       rel="noopener noreferrer">Impressum</a>
                    <a href="https://gnm.dev/privacy" target="_blank"
                       rel="noopener noreferrer">Datenschutz</a>
                </div>
                <p className="footer-copy">MIT Lizenz · Made with ♥ for schools</p>
            </div>
        </footer>
    );
};
