import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faGamepad,
    faBook,
    faServer,
    faMobileScreen,
    faShieldHalved,
    faMoneyBill,
    faBrain,
    faChartBar,
    faGraduationCap,
    faQrcode,
    faPalette,
    faRocket,
    faFileExport
} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    visible: {opacity: 1, y: 0}
};

const stagger = {
    visible: {transition: {staggerChildren: 0.08}}
};

const coreFeatures = [
    {icon: faGamepad, title: "Live-Quizze", description: "Starte ein Quiz und lass deine Klasse in Echtzeit gegeneinander antreten. Die Ergebnisse und Rangliste werden live angezeigt."},
    {icon: faBook, title: "Übungsmodus", description: "Quizze lassen sich als Übungslink teilen, damit Schüler eigenständig üben können - ideal zur Klausurvorbereitung."},
    {icon: faQrcode, title: "QR-Code Beitritt", description: "Schüler scannen einfach einen QR-Code und sind direkt dabei. Kein Login, keine Registrierung nötig."},
    {icon: faBrain, title: "KI-Fragengeneration", description: "Quizfragen lassen sich per KI generieren. Unterstützt werden OpenAI, Anthropic, Google Gemini und lokale Modelle über Ollama."},
    {icon: faChartBar, title: "Detaillierte Analysen", description: "Auswertungen pro Frage und pro Schüler helfen dabei, Wissenslücken zu erkennen und den Unterricht anzupassen."},
    {icon: faGraduationCap, title: "Verschiedene Fragetypen", description: "Multiple Choice, Freitext, Wahr/Falsch und mehr - so entstehen abwechslungsreiche Quizze für jedes Fach."},
];

const techFeatures = [
    {icon: faServer, title: "Self-Hosted", description: "Quizzle läuft auf deinem eigenen Server. Die Daten bleiben komplett unter deiner Kontrolle."},
    {icon: faShieldHalved, title: "DSGVO-Konform", description: "Keine externen Dienste, kein Tracking, keine Cookies. Alles bleibt auf deinem Server."},
    {icon: faMoneyBill, title: "Komplett Kostenlos", description: "Open Source unter MIT-Lizenz. Keine Limits, keine Abos, keine versteckten Kosten."},
    {icon: faMobileScreen, title: "Responsive Design", description: "Läuft auf Desktop, Tablet und Smartphone. Schüler brauchen nur einen Browser."},
    {icon: faPalette, title: "Eigenes Branding", description: "Logo, Farben und Name lassen sich frei anpassen - passend zu deiner Schule oder Organisation."},
    {icon: faFileExport, title: "Ergebnisexport", description: "Quizergebnisse können als Excel-Datei exportiert werden."},
];

export const Features = () => {
    return (
        <div className="features-page">
            <motion.section className="page-header" initial="hidden" animate="visible" variants={stagger}>
                <motion.h1 variants={fadeUp} transition={{duration: 0.5}}>Funktionen</motion.h1>
                <motion.p variants={fadeUp} transition={{duration: 0.5, delay: 0.1}}>
                    Alles, was du für interaktive Quizze im Unterricht brauchst.
                </motion.p>
            </motion.section>

            <motion.section
                className="section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.1}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>Quiz-Funktionen</motion.h2>
                <div className="features-grid">
                    {coreFeatures.map((f, i) => (
                        <motion.div key={i} className="feature-card" variants={fadeUp} transition={{duration: 0.4}}
                                    whileHover={{y: -5, transition: {duration: 0.2}}}>
                            <div className="feature-icon">
                                <FontAwesomeIcon icon={f.icon}/>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.1}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>Technik & Sicherheit</motion.h2>
                <div className="features-grid">
                    {techFeatures.map((f, i) => (
                        <motion.div key={i} className="feature-card tech-card" variants={fadeUp}
                                    transition={{duration: 0.4}}
                                    whileHover={{y: -5, transition: {duration: 0.2}}}>
                            <div className="feature-icon feature-icon-green">
                                <FontAwesomeIcon icon={f.icon}/>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="section cta-section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>Überzeugt?</motion.h2>
                <motion.p className="cta-text" variants={fadeUp} transition={{duration: 0.5, delay: 0.1}}>
                    Quizzle ist in wenigen Minuten installiert und direkt einsatzbereit.
                </motion.p>
                <motion.div variants={fadeUp} transition={{duration: 0.5, delay: 0.2}}>
                    <Link to="/installation" className="btn btn-primary btn-large">
                        <FontAwesomeIcon icon={faRocket}/>
                        Jetzt installieren
                    </Link>
                </motion.div>
            </motion.section>
        </div>
    );
};
