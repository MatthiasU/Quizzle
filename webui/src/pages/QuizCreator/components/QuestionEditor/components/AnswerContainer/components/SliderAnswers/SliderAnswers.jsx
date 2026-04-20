import "./styles.sass";
import {useMemo, useRef, useCallback} from "react";
import {SLIDER_MARGIN_CONFIG} from "@/common/constants/QuestionTypes.js";

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

export const SliderAnswers = ({answers, onChange}) => {
    const config = answers[0] || {correctValue: 50, min: 0, max: 100, step: 1, answerMargin: 'medium'};
    const trackRef = useRef(null);
    const dragging = useRef(false);

    const updateConfig = useCallback((updates) => {
        const next = {...config, ...updates};
        next.step = computeStep(next.min, next.max);
        next.correctValue = Math.max(next.min, Math.min(next.max, next.correctValue));
        onChange([next]);
    }, [config, onChange]);

    const marginConfig = SLIDER_MARGIN_CONFIG[config.answerMargin || 'medium'];
    const range = config.max - config.min;
    const marginFactor = marginConfig?.factor || 0.1;
    const marginValue = range > 0 ? range * marginFactor : 0;
    const marginLow = Math.max(config.min, config.correctValue - marginValue);
    const marginHigh = Math.min(config.max, config.correctValue + marginValue);
    const step = computeStep(config.min, config.max);

    const snapToValue = useCallback((clientX) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return config.correctValue;
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw = config.min + pct * range;
        return Math.round(raw / step) * step;
    }, [config.min, range, step, config.correctValue]);

    const handlePointerDown = useCallback((e) => {
        dragging.current = true;
        trackRef.current?.setPointerCapture(e.pointerId);
        updateConfig({correctValue: snapToValue(e.clientX)});
    }, [snapToValue, updateConfig]);

    const handlePointerMove = useCallback((e) => {
        if (!dragging.current) return;
        updateConfig({correctValue: snapToValue(e.clientX)});
    }, [snapToValue, updateConfig]);

    const handlePointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    const ticks = useMemo(() => {
        const items = [];
        for (let i = 0; i <= TICK_COUNT; i++) {
            const tickVal = config.min + (range / TICK_COUNT) * i;
            const inMargin = config.answerMargin !== 'none' && tickVal >= marginLow && tickVal <= marginHigh;
            items.push(<div key={i} className={`tick${inMargin ? ' tick--active' : ''}`} />);
        }
        return items;
    }, [config.min, range, config.answerMargin, marginLow, marginHigh]);

    return (
        <div className="slider-answers">
            <div className="slider-value-input">
                <input
                    type="number"
                    value={config.correctValue}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!isNaN(v) && v >= config.min && v <= config.max) updateConfig({correctValue: v});
                    }}
                    min={config.min}
                    max={config.max}
                    step={step}
                />
                <span className="slider-value-label">Richtige Antwort</span>
            </div>

            <div className="slider-track-row">
                <div className="edge-input">
                    <span className="edge-label">Min.</span>
                    <input
                        type="number"
                        value={config.min}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (!isNaN(v) && v < config.max) updateConfig({min: v});
                        }}
                    />
                </div>

                <div className="track-wrapper">
                    <div
                        className="tick-track"
                        ref={trackRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        {ticks}
                    </div>
                </div>

                <div className="edge-input">
                    <span className="edge-label">Max.</span>
                    <input
                        type="number"
                        value={config.max}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (!isNaN(v) && v > config.min) updateConfig({max: v});
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
