import {QUESTION_TYPES} from "@/common/constants/QuestionTypes.js";

const ANSWER_COLORS = ["#FFA500", "#6547EE", "#1C945A", "#EC5555"];

export const getAnswerColorByIndex = (index) => ANSWER_COLORS[index] ?? ANSWER_COLORS[0];

export const getTrueFalseAnswerColor = (answer) => {
    const content = answer.content?.toString().toLowerCase();
    if (content === 'true' || content === 'wahr' || content === 'richtig') return "#1C945A";
    return "#EC5555";
};

export const getAnswerColor = (answer, index, questionType) => {
    if (questionType === QUESTION_TYPES.TRUE_FALSE) return getTrueFalseAnswerColor(answer);
    return getAnswerColorByIndex(index);
};

export const getAnswerGradient = (answer, index, questionType) => {
    const color = getAnswerColor(answer, index, questionType);
    return `linear-gradient(135deg, color-mix(in srgb, ${color} 100%, white 20%), color-mix(in srgb, ${color} 100%, black 10%))`;
};
