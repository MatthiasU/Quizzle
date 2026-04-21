import "./styles.sass";

const SHAPES = ["triangle", "diamond", "circle", "square", "pentagon", "hexagon"];

export const getAnswerShapeByIndex = (index) => SHAPES[index % SHAPES.length];

export const AnswerShape = ({index, size = "1.5rem", color = "white", className = "", questionType}) => {
    const isTrueFalse = questionType === "true-false";
    const shape = isTrueFalse ? (index === 0 ? "check" : "xmark") : getAnswerShapeByIndex(index);
    const s = typeof size === "number" ? `${size}px` : size;

    return (
        <span
            className={`answer-shape answer-shape-${shape} ${className}`}
            style={{width: s, height: s, color}}
            aria-hidden="true"
        >
            {shape === "check" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4,13 10,19 20,6"/>
                </svg>
            )}
            {shape === "xmark" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="5" x2="19" y2="19"/>
                    <line x1="19" y1="5" x2="5" y2="19"/>
                </svg>
            )}
            {shape === "triangle" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <polygon points="12,3 22,21 2,21" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                </svg>
            )}
            {shape === "diamond" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <polygon points="12,2 22,12 12,22 2,12"/>
                </svg>
            )}
            {shape === "circle" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
            )}
            {shape === "square" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
            )}
            {shape === "pentagon" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <polygon points="12,2 22,9.5 18,22 6,22 2,9.5"/>
                </svg>
            )}
            {shape === "hexagon" && (
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                    <polygon points="6,3 18,3 23,12 18,21 6,21 1,12"/>
                </svg>
            )}
        </span>
    );
};