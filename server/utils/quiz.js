const pako = require("pako");

const resolveQuestionType = (type, answers) => {
    if (type !== 'multiple-choice') return type;
    const correctCount = answers.filter(a => a.is_correct).length;
    return correctCount > 1 ? 'multiple' : 'single';
};

const shuffleSequenceAnswers = (answers) => {
    const items = answers.map((answer, index) => ({
        content: answer.content,
        type: answer.type || 'text',
        originalIndex: index
    }));

    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
};

const stripAnswerContent = (answers) => {
    return answers.map(({ content, ...rest }) => rest);
};

const stripAnswerCorrectness = (answers) => {
    return answers.map(answer => ({
        content: answer.content,
        type: answer.type || 'text'
    }));
};

const decompressQuiz = (buffer) => {
    const decompressed = pako.inflate(buffer, { to: 'string' });
    return JSON.parse(decompressed);
};

const compressQuiz = (data) => {
    return pako.deflate(JSON.stringify(data), { to: 'string' });
};

module.exports = {
    resolveQuestionType,
    shuffleSequenceAnswers,
    stripAnswerContent,
    stripAnswerCorrectness,
    decompressQuiz,
    compressQuiz
};
