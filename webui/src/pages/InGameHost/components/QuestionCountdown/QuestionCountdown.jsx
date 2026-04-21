import {useEffect, useState} from "react";
import {useSoundManager} from "@/common/utils/SoundManager.js";
import "./styles.sass";

export const QuestionCountdown = ({isActive, from = 3, onComplete}) => {
    const [value, setValue] = useState(from);
    const [tick, setTick] = useState(0);
    const soundManager = useSoundManager();

    useEffect(() => {
        if (!isActive) return;

        setValue(from);
        setTick(0);
        soundManager.playFeedback('TIMER_TICK');

        let current = from;
        let step = 0;
        const interval = setInterval(() => {
            current -= 1;
            step += 1;
            if (current <= 0) {
                clearInterval(interval);
                onComplete?.();
                return;
            }
            setValue(current);
            setTick(step);
            soundManager.playFeedback('TIMER_TICK');
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, from]);

    if (!isActive) return null;

    return (
        <div className="question-countdown-overlay">
            <div className="question-countdown-stack">
                <div
                    className="question-countdown-diamond"
                    style={{transform: `rotate(${45 + tick * 90}deg)`}}
                />
                <span className="question-countdown-number">
                    {value}
                </span>
            </div>
        </div>
    );
};
