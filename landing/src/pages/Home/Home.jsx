import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRocket} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    visible: {opacity: 1, y: 0}
};

const stagger = {
    visible: {transition: {staggerChildren: 0.1}}
};

export const Home = () => {
    return (
        <div className="home-page">
            <motion.section className="hero" initial="hidden" animate="visible" variants={stagger}>
                <motion.img src="/quizzle-title.png" alt="Quizzle" className="hero-logo" variants={fadeUp}
                            transition={{duration: 0.6}}/>
                <motion.p className="hero-subtitle" variants={fadeUp} transition={{duration: 0.6, delay: 0.1}}>
                    Die kostenlose, open-source Quiz-Plattform für Schulen
                </motion.p>
                <motion.p className="hero-tagline" variants={fadeUp} transition={{duration: 0.6, delay: 0.2}}>
                    Self-hosted · Datenschutz-konform · Keine monatlichen Kosten
                </motion.p>
                <motion.div className="hero-actions" variants={fadeUp} transition={{duration: 0.6, delay: 0.3}}>
                    <Link to="/installation" className="btn btn-primary">
                        <FontAwesomeIcon icon={faRocket}/>
                        Jetzt starten
                    </Link>
                    <Link to="/funktionen" className="btn btn-secondary">
                        Funktionen entdecken
                    </Link>
                </motion.div>
            </motion.section>
        </div>
    );
};
