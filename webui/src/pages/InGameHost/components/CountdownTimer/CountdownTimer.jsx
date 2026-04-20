import "./styles.sass";
import {useState, useEffect, useRef} from "react";
import {useSoundManager} from "@/common/utils/SoundManager.js";
import {motion, AnimatePresence} from "framer-motion";

export const CountdownTimer = ({duration, onTimeUp, isActive = true}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [phase, setPhase] = useState('normal');
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef(null);
    const soundManager = useSoundManager();
    const lastTickRef = useRef(null);

    useEffect(() => {
        setTimeLeft(duration);
        setPhase('normal');
        setIsVisible(true);
    }, [duration]);

    useEffect(() => {
        if (!isActive || duration <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsVisible(false);
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                const newTime = prevTime - 1;

                if (newTime <= 10 && newTime > 0) {
                    if (newTime !== lastTickRef.current) {
                        soundManager.playFeedback('TIMER_TICK');
                        lastTickRef.current = newTime;
                    }
                }

                if (newTime <= 10 && newTime > 0) {
                    setPhase('critical');
                } else if (newTime <= 30) {
                    setPhase('warning');
                } else {
                    setPhase('normal');
                }

                if (newTime <= 0) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    soundManager.playFeedback('ANSWER_REVEALED');
                    setIsVisible(false);
                    onTimeUp();
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, duration, onTimeUp, soundManager]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return secs.toString();
    };

    const percentage = duration > 0 ? (timeLeft / duration) * 100 : 0;

    if (duration <= 0 || !isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className={`countdown-bar ${phase}`}
                initial={{opacity: 0, y: -8}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -8}}
                transition={{duration: 0.3, ease: "easeOut"}}
            >
                <div className="bar-track">
                    <motion.div
                        className="bar-fill"
                        animate={{width: `${percentage}%`}}
                        transition={{duration: 1, ease: "linear"}}
                    />
                </div>
                <div className="bar-time">
                    <span className="bar-number">{formatTime(timeLeft)}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};