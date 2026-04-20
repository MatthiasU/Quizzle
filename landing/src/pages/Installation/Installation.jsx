import {motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTerminal,
    faDownload,
    faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faWindows, faLinux} from "@fortawesome/free-brands-svg-icons";
import "./styles.sass";

const fadeUp = {
    hidden: {opacity: 0, y: 30},
    visible: {opacity: 1, y: 0}
};

const stagger = {
    visible: {transition: {staggerChildren: 0.08}}
};

export const Installation = () => {
    return (
        <div className="install-page">
            <motion.section className="page-header" initial="hidden" animate="visible" variants={stagger}>
                <motion.h1 variants={fadeUp} transition={{duration: 0.5}}>Installation</motion.h1>
                <motion.p variants={fadeUp} transition={{duration: 0.5, delay: 0.1}}>
                    Quizzle in wenigen Minuten auf deinem Server einrichten - mit Docker oder als Installer.
                </motion.p>
            </motion.section>

            <motion.section
                className="section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.2}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>
                    <FontAwesomeIcon icon={faTerminal}/> Docker (empfohlen)
                </motion.h2>

                <motion.div className="install-step" variants={fadeUp} transition={{duration: 0.4}}>
                    <div className="step-label">
                        <span className="step-number">1</span>
                        <h3>Docker-Compose Datei erstellen</h3>
                    </div>
                    <p className="step-desc">Erstell eine <code>docker-compose.yml</code> mit folgendem Inhalt:</p>
                    <div className="code-block">
                        <div className="code-header">docker-compose.yml</div>
                        <pre><code>{`version: '3.8'
services:
  quizzle:
    image: germannewsmaker/quizzle:latest
    ports:
      - "6412:6412"
    volumes:
      - ./data:/quizzle/data
    environment:
      - TZ=Europe/Berlin
    restart: unless-stopped`}</code></pre>
                    </div>
                </motion.div>

                <motion.div className="install-step" variants={fadeUp} transition={{duration: 0.4}}>
                    <div className="step-label">
                        <span className="step-number">2</span>
                        <h3>Container starten</h3>
                    </div>
                    <div className="code-block">
                        <div className="code-header">Terminal</div>
                        <pre><code>docker compose up -d</code></pre>
                    </div>
                </motion.div>

                <motion.div className="install-step" variants={fadeUp} transition={{duration: 0.4}}>
                    <div className="step-label">
                        <span className="step-number">3</span>
                        <h3>Quizzle öffnen</h3>
                    </div>
                    <p className="step-desc">
                        Öffne <code>http://localhost:6412</code> im Browser.
                        Beim ersten Start hilft dir ein Setup-Assistent bei der Konfiguration.
                    </p>
                </motion.div>

                <motion.div className="success-banner" variants={fadeUp} transition={{duration: 0.4}}>
                    <FontAwesomeIcon icon={faCircleCheck}/>
                    <span>Das wars! Quizzle ist jetzt einsatzbereit.</span>
                </motion.div>
            </motion.section>

            <motion.section
                className="section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.2}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>
                    <FontAwesomeIcon icon={faDownload}/> Installer herunterladen
                </motion.h2>

                <motion.p className="section-desc" variants={fadeUp} transition={{duration: 0.4}}>
                    Lade den passenden Installer für dein Betriebssystem herunter und starte Quizzle direkt - ohne Docker oder Terminal.
                </motion.p>

                <div className="download-grid">
                    <motion.a
                        href="https://github.com/gnmyt/Quizzle/releases/latest"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-card"
                        variants={fadeUp}
                        transition={{duration: 0.4}}
                    >
                        <FontAwesomeIcon icon={faWindows} className="download-icon"/>
                        <h3>Windows</h3>
                        <p>Installer (.msi)</p>
                        <span className="btn btn-primary btn-small">
                            <FontAwesomeIcon icon={faDownload}/> Download
                        </span>
                    </motion.a>

                    <motion.a
                        href="https://github.com/gnmyt/Quizzle/releases/latest"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-card"
                        variants={fadeUp}
                        transition={{duration: 0.4}}
                    >
                        <FontAwesomeIcon icon={faLinux} className="download-icon"/>
                        <h3>Linux</h3>
                        <p>Paket (.deb / .tar.gz)</p>
                        <span className="btn btn-primary btn-small">
                            <FontAwesomeIcon icon={faDownload}/> Download
                        </span>
                    </motion.a>
                </div>

                <motion.p className="download-hint" variants={fadeUp} transition={{duration: 0.4}}>
                    Alle Versionen und Changelogs findest du auf der{" "}
                    <a href="https://github.com/gnmyt/Quizzle/releases" target="_blank" rel="noopener noreferrer">
                        GitHub Releases-Seite
                    </a>.
                </motion.p>
            </motion.section>

            <motion.section
                className="section cta-section"
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                variants={stagger}
            >
                <motion.h2 variants={fadeUp} transition={{duration: 0.5}}>Hilfe & Mitwirken</motion.h2>
                <motion.p className="cta-text" variants={fadeUp} transition={{duration: 0.5, delay: 0.1}}>
                    Hast du Fragen, Probleme oder möchtest zum Projekt beitragen? Besuche uns auf GitHub.
                </motion.p>
                <motion.div className="cta-actions" variants={fadeUp} transition={{duration: 0.5, delay: 0.2}}>
                    <a href="https://github.com/gnmyt/Quizzle" target="_blank" rel="noopener noreferrer"
                       className="btn btn-dark btn-large">
                        <FontAwesomeIcon icon={faGithub}/>
                        GitHub Repository
                    </a>
                </motion.div>
            </motion.section>
        </div>
    );
};
