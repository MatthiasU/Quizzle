import "./styles.sass";
import {useState, useMemo, useCallback, useEffect, useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

const TICK_COUNT = 40;

const computeStep = (min, max) => {
    const range = max - min;
    if (range <= 0) return 1;
    if (range <= 10) return 0.1;
    if (range <= 100) return 1;
    if (range <= 1000) return 5;
    if (range <= 10000) return 10;
    return 50;
};

export const SliderClient = ({question, onSubmit}) => {
    const config = question.sliderConfig || {min: 0, max: 100, step: 1};
    const step = computeStep(config.min, config.max);
    const midPoint = Math.round((config.min + config.max) / 2 / step) * step;
    const [value, setValue] = useState(midPoint);
    const [submitted, setSubmitted] = useState(false);
    const trackRef = useRef(null);
    const dragging = useRef(false);

    const range = config.max - config.min;

    const snapToValue = useCallback((clientX) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return value;
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw = config.min + pct * range;
        return Math.round(raw / step) * step;
    }, [config.min, range, step, value]);

    const handlePointerDown = useCallback((e) => {
        if (submitted) return;
        dragging.current = true;
        trackRef.current?.setPointerCapture(e.pointerId);
        setValue(snapToValue(e.clientX));
    }, [snapToValue, submitted]);

    const handlePointerMove = useCallback((e) => {
        if (!dragging.current || submitted) return;
        setValue(snapToValue(e.clientX));
    }, [snapToValue, submitted]);

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const handleSubmit = () => {
        if (!submitted) {
            setSubmitted(true);
            onSubmit(value);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (submitted) return;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                setValue(prev => Math.max(config.min, Math.round((prev - step) / step) * step));
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                setValue(prev => Math.min(config.max, Math.round((prev + step) / step) * step));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submitted, config.min, config.max, step]);

    const valuePct = range > 0 ? ((value - config.min) / range) * 100 : 50;

    const ticks = useMemo(() => {
        const items = [];
        for (let i = 0; i <= TICK_COUNT; i++) {
            const tickVal = config.min + (range / TICK_COUNT) * i;
            const isBeforeValue = tickVal <= value;
            items.push(<div key={i} className={`tick${isBeforeValue ? ' tick--active' : ''}`} />);
        }
        return items;
    }, [config.min, range, value]);

    return (
        <div className="slider-client">
            <div className="slider-value-badge">
                <span className="value-number">{value}</span>
            </div>

            <div className="slider-track-row">
                <div className="edge-label">{config.min}</div>

                <div className="track-wrapper">
                    <div
                        className={`tick-track${submitted ? ' tick-track--disabled' : ''}`}
                        ref={trackRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        {ticks}
                    </div>
                </div>

                <div className="edge-label">{config.max}</div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitted}
                className={`submit-slider-answer ${!submitted ? 'submit-shown' : ''}`}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Antwort senden</span>
            </button>
        </div>
    );
};
