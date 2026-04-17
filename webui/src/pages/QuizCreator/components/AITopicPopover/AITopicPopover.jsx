import {useState, useRef, useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWandMagicSparkles, faSpinner} from "@fortawesome/free-solid-svg-icons";
import "./styles.sass";

export const AITopicPopover = ({generating, onGenerate, onStop}) => {
    const [showInput, setShowInput] = useState(false);
    const [topic, setTopic] = useState("");
    const [count, setCount] = useState("");
    const inputRef = useRef(null);
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target) && !generating) {
                setShowInput(false);
            }
        };
        if (showInput) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInput, generating]);

    useEffect(() => {
        if (showInput && inputRef.current) inputRef.current.focus();
    }, [showInput]);

    const handleGenerate = () => {
        if (!topic.trim()) return;
        const parsedCount = count ? parseInt(count, 10) : undefined;
        onGenerate(topic.trim(), parsedCount);
        setShowInput(false);
        setTopic("");
        setCount("");
    };

    const handleButtonClick = () => {
        if (generating) {
            onStop();
        } else {
            setShowInput(!showInput);
        }
    };

    return (
        <div className="ai-generate-container" ref={popoverRef}>
            <div
                className={`action-button ai-generate ${generating ? 'generating' : ''}`}
                onClick={handleButtonClick}
                title={generating ? "Generierung abbrechen" : "Quiz mit KI generieren"}
            >
                <FontAwesomeIcon icon={generating ? faSpinner : faWandMagicSparkles} spin={generating} />
            </div>

            <AnimatePresence>
                {showInput && (
                    <motion.div
                        className="ai-topic-popover"
                        initial={{opacity: 0, y: -8, scale: 0.95}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -8, scale: 0.95}}
                        transition={{duration: 0.15}}
                    >
                        <input
                            ref={inputRef}
                            className="ai-topic-input"
                            type="text"
                            placeholder="Thema eingeben..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            maxLength={200}
                        />
                        <input
                            className="ai-count-input"
                            type="number"
                            placeholder="Anz."
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            min={1}
                            max={50}
                        />
                        <button
                            className="ai-topic-go"
                            onClick={handleGenerate}
                            disabled={!topic.trim()}
                        >
                            <FontAwesomeIcon icon={faWandMagicSparkles} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
