const { resolveQuestionType } = require('./quiz');

const getActivePlayers = (room, io) => {
    const activePlayers = {};
    for (const [playerId, player] of Object.entries(room.players)) {
        const playerSocket = io.sockets.sockets.get(playerId);
        if (playerSocket?.connected) activePlayers[playerId] = player;
    }
    return activePlayers;
};

const buildQuestionPayload = (question, room) => {
    const questionData = {
        type: resolveQuestionType(question.type, question.answers || []),
        title: question.title
    };

    if (question.type === 'text') {
        questionData.maxLength = 200;
    } else if (question.type === 'sequence') {
        const historyEntry = room.questionHistory[room.questionHistory.length - 1];
        questionData.answers = historyEntry?.shuffledAnswers || question.answers;
    } else if (question.type === 'slider') {
        const config = Array.isArray(question.answers) ? question.answers[0] : question.answers;
        questionData.sliderConfig = {
            min: config.min,
            max: config.max,
            step: config.step || 1
        };
    } else {
        questionData.answers = Array.isArray(question.answers)
            ? question.answers.length
            : question.answers;
    }

    return questionData;
};

const generateAnswerData = (currentQuestion, currentAnswers, room) => {
    if (currentQuestion.type === 'text') {
        return { answers: currentQuestion.answers.map(a => a.content) };
    }

    if (currentQuestion.type === 'slider') {
        const config = Array.isArray(currentQuestion.answers) ? currentQuestion.answers[0] : currentQuestion.answers;
        const playerValues = Object.values(currentAnswers).filter(v => typeof v === 'number');
        return {
            correctValue: config.correctValue,
            min: config.min,
            max: config.max,
            answerMargin: config.answerMargin || 'medium',
            playerValues
        };
    }

    if (currentQuestion.type === 'sequence') {
        const historyEntry = room.questionHistory[room.questionHistory.length - 1];
        const answers = historyEntry ? historyEntry.answers : currentQuestion.answers;
        return {
            answers,
            correctOrder: (Array.isArray(answers) ? answers : []).map((_, i) => i)
        };
    }

    const voteCounts = new Array(
        Array.isArray(currentQuestion.answers)
            ? currentQuestion.answers.length
            : currentQuestion.answers
    ).fill(0);

    Object.values(currentAnswers).forEach(playerAnswers => {
        if (Array.isArray(playerAnswers)) {
            playerAnswers.forEach(idx => {
                if (idx >= 0 && idx < voteCounts.length) voteCounts[idx]++;
            });
        }
    });

    return {
        answers: Array.isArray(currentQuestion.answers)
            ? currentQuestion.answers.map(a => a.is_correct)
            : [],
        voteCounts
    };
};

const broadcastAnswerResults = (io, roomCode, answerData, room) => {
    io.to(roomCode.toString()).emit('ANSWER_RECEIVED', answerData);
    for (const player of Object.keys(room.players)) {
        io.to(player).emit("POINTS_RECEIVED", room.players[player].points);
    }
};

module.exports = {
    getActivePlayers,
    buildQuestionPayload,
    generateAnswerData,
    broadcastAnswerResults
};
