import {QUESTION_TYPES} from "@/common/constants/QuestionTypes.js";

const ANSWER_COLORS = ["#E21B3C", "#1368CE", "#D89E00", "#26890C", "#864CBF", "#0AA3A3"];
const ANSWER_SHAPES = ["triangle", "diamond", "circle", "square", "pentagon", "hexagon"];

export const getAnswerColorByIndex = (index) => ANSWER_COLORS[index % ANSWER_COLORS.length];

export const getAnswerShapeByIndex = (index) => ANSWER_SHAPES[index % ANSWER_SHAPES.length];

export const getTrueFalseAnswerColor = (answer) => {
    const content = answer.content?.toString().toLowerCase();
    if (content === 'true' || content === 'wahr' || content === 'richtig') return "#26890C";
    return "#E21B3C";
};

export const getAnswerColor = (answer, index, questionType) => {
    if (questionType === QUESTION_TYPES.TRUE_FALSE) return getTrueFalseAnswerColor(answer);
    return getAnswerColorByIndex(index);
};

export const getAnswerShape = (_answer, index, questionType) => {
    if (questionType === QUESTION_TYPES.TRUE_FALSE) return index === 0 ? "square" : "triangle";
    return getAnswerShapeByIndex(index);
};

export const getAnswerGradient = (answer, index, questionType) => {
    const color = getAnswerColor(answer, index, questionType);
    return `linear-gradient(180deg, color-mix(in srgb, ${color} 100%, white 8%), color-mix(in srgb, ${color} 100%, black 14%))`;
};
