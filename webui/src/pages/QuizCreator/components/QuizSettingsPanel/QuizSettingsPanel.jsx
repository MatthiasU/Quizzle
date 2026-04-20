import "./styles.sass";
import SelectBox from "@/common/components/SelectBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faClock,
    faShuffle,
    faCoins,
    faAlignLeft,
    faSignal,
} from "@fortawesome/free-solid-svg-icons";
import {motion} from "framer-motion";
import {DEFAULT_QUIZ_SETTINGS} from "@/common/constants/QuizSettings.js";

export const QuizSettingsPanel = ({settings, onChange}) => {
    const s = {...DEFAULT_QUIZ_SETTINGS, ...settings};

    const update = (key, value) => {
        onChange({...s, [key]: value});
    };

    const difficultyOptions = [
        {value: "none", label: "Keine Angabe", description: "Keine Schwierigkeit angegeben", icon: faSignal},
        {value: "easy", label: "Einfach", description: "Für Einsteiger", icon: faSignal},
        {value: "medium", label: "Mittel", description: "Fortgeschrittene Fragen", icon: faSignal},
        {value: "hard", label: "Schwer", description: "Anspruchsvolle Fragen", icon: faSignal},
    ];

    const timerOptions = [
        {value: "15", label: "15 Sekunden", description: "Sehr schnelle Fragen", icon: faClock},
        {value: "30", label: "30 Sekunden", description: "Schnelle Fragen", icon: faClock},
        {value: "60", label: "60 Sekunden", description: "Eine Minute pro Frage", icon: faClock},
        {value: "120", label: "2 Minuten", description: "Mehr Zeit zum Nachdenken", icon: faClock},
        {value: "-1", label: "Unbegrenzt", description: "Kein Zeitlimit", icon: faClock},
    ];

    const scoringOptions = [
        {value: "time-based", label: "Zeitbasiert", description: "Schnellere Antworten = mehr Punkte", icon: faCoins},
        {value: "flat", label: "Gleichmäßig", description: "Feste Punkte pro richtiger Antwort", icon: faCoins},
    ];

    return (
        <motion.div
            className="quiz-settings-panel"
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.25, delay: 0.1, ease: "easeOut"}}
        >
            <div className="settings-header">
                <h3>Quiz-Einstellungen</h3>
            </div>

            <div className="settings-section">
                <div className="section-title">Über das Quiz</div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faAlignLeft}/>
                        <span>Beschreibung</span>
                    </div>
                    <textarea
                        className="settings-textarea"
                        placeholder="Worum geht es in diesem Quiz?"
                        value={s.description}
                        onChange={(e) => update("description", e.target.value)}
                        maxLength={300}
                        rows={3}
                    />
                    <div className="char-count">{s.description.length}/300</div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faSignal}/>
                        <span>Schwierigkeit</span>
                    </div>
                    <SelectBox
                        value={s.difficulty || "none"}
                        onChange={(v) => update("difficulty", v === "none" ? null : v)}
                        options={difficultyOptions}
                        placeholder="Schwierigkeit auswählen..."
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="section-title">Spielablauf</div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faShuffle}/>
                        <span>Fragen mischen</span>
                    </div>
                    <div className="toggle-row" onClick={() => update("shuffleQuestions", !s.shuffleQuestions)}>
                        <div className={`toggle ${s.shuffleQuestions ? "active" : ""}`}>
                            <div className="toggle-knob"/>
                        </div>
                        <span className="toggle-text">{s.shuffleQuestions ? "Ein" : "Aus"}</span>
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faShuffle}/>
                        <span>Antworten mischen</span>
                    </div>
                    <div className="toggle-row" onClick={() => update("shuffleAnswers", !s.shuffleAnswers)}>
                        <div className={`toggle ${s.shuffleAnswers ? "active" : ""}`}>
                            <div className="toggle-knob"/>
                        </div>
                        <span className="toggle-text">{s.shuffleAnswers ? "Ein" : "Aus"}</span>
                    </div>
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faClock}/>
                        <span>Standard-Zeitlimit</span>
                    </div>
                    <SelectBox
                        value={String(s.defaultTimer)}
                        onChange={(v) => update("defaultTimer", parseInt(v))}
                        options={timerOptions}
                        placeholder="Zeitlimit auswählen..."
                    />
                </div>

                <div className="setting-group">
                    <div className="setting-label">
                        <FontAwesomeIcon icon={faCoins}/>
                        <span>Punktevergabe</span>
                    </div>
                    <SelectBox
                        value={s.scoringMode}
                        onChange={(v) => update("scoringMode", v)}
                        options={scoringOptions}
                        placeholder="Punktevergabe auswählen..."
                    />
                </div>
            </div>
        </motion.div>
    );
};
