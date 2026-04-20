import { useEffect, useState, useRef } from "react";
import "./styles.sass";

export const AnimatedCounter = ({ value, previousValue = 0, delay = 0, duration = 1200 }) => {
    const [displayValue, setDisplayValue] = useState(previousValue);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        const startValue = previousValue;
        const endValue = value;
        const diff = endValue - startValue;

        if (diff === 0) {
            setDisplayValue(value);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsAnimating(true);
            startTimeRef.current = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                const eased = 1 - Math.pow(1 - progress, 3);

                const currentValue = Math.round(startValue + diff * eased);
                setDisplayValue(currentValue);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setDisplayValue(endValue);
                    setIsAnimating(false);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value, previousValue, delay, duration]);

    const digits = String(displayValue).split("");

    return (
        <span className={`animated-counter ${isAnimating ? "counting" : ""}`}>
            {digits.map((digit, index) => (
                <span
                    key={`${index}-${digits.length}`}
                    className={`counter-digit ${isAnimating ? "digit-rolling" : ""}`}
                >
                    {digit}
                </span>
            ))}
        </span>
    );
};