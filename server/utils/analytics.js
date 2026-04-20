const { evaluateSequenceAnswer, evaluateTextAnswer, evaluateChoiceAnswer, evaluateSliderAnswer } = require('./scoring');

const classifyAnswer = (answer, question) => {
    if (question.type === 'text') {
        return evaluateTextAnswer(answer, question.answers) ? 'correct' : 'incorrect';
    }

    if (question.type === 'slider') {
        const result = evaluateSliderAnswer(answer, question);
        if (result.isCorrect && result.score >= 0.9) return 'correct';
        if (result.isCorrect) return 'partial';
        return 'incorrect';
    }

    if (question.type === 'sequence') {
        const result = evaluateSequenceAnswer(answer, question);
        if (result.isCorrect) return 'correct';
        return result.isPartial ? 'partial' : 'incorrect';
    }

    const { result } = evaluateChoiceAnswer(answer, question.answers);
    return result;
};

const generateQuestionAnalytics = (playerAnswers, questionHistory) => {
    return playerAnswers.map((questionAnswers, questionIndex) => {
        const totalResponses = Object.keys(questionAnswers).length;
        const question = questionHistory[questionIndex];

        if (!question) {
            return {
                questionIndex,
                totalResponses: 0,
                correctCount: 0,
                partialCount: 0,
                incorrectCount: 0,
                correctPercentage: 0,
                difficulty: 'unknown',
                title: 'Unknown Question'
            };
        }

        let correctCount = 0;
        let partialCount = 0;
        let incorrectCount = 0;

        for (const playerAnswer of Object.values(questionAnswers)) {
            const classification = classifyAnswer(playerAnswer, question);
            if (classification === 'correct') correctCount++;
            else if (classification === 'partial') partialCount++;
            else incorrectCount++;
        }

        const correctPercentage = totalResponses > 0
            ? Math.round((correctCount / totalResponses) * 100)
            : 0;

        return {
            questionIndex,
            title: question.title,
            type: question.type,
            totalResponses,
            correctCount,
            partialCount,
            incorrectCount,
            correctPercentage,
            difficulty: totalResponses > 0
                ? (correctPercentage >= 80 ? 'easy' : correctPercentage >= 60 ? 'medium' : 'hard')
                : 'unknown',
            needsReview: correctPercentage < 60
        };
    });
};

const generateStudentAnalytics = (players, playerAnswers, questionHistory) => {
    return players.map(player => {
        const studentAnswers = playerAnswers.map(qa => qa[player.id]);

        let correctAnswers = 0;
        let partialAnswers = 0;
        let incorrectAnswers = 0;

        studentAnswers.forEach((answer, questionIndex) => {
            const question = questionHistory[questionIndex];
            if (answer === undefined || !question) return;

            const classification = classifyAnswer(answer, question);
            if (classification === 'correct') correctAnswers++;
            else if (classification === 'partial') partialAnswers++;
            else incorrectAnswers++;
        });

        const totalAnswered = studentAnswers.filter(a => a !== undefined).length;

        return {
            id: player.id,
            name: player.name,
            character: player.character,
            totalPoints: player.points,
            correctAnswers,
            partialAnswers,
            incorrectAnswers,
            totalAnswered,
            accuracy: totalAnswered > 0
                ? Math.round((correctAnswers / totalAnswered) * 100)
                : 0,
            needsAttention: correctAnswers < (totalAnswered * 0.6)
        };
    });
};

const generateClassAnalytics = (studentAnalytics, questionAnalytics, totalPlayers, totalQuestions) => {
    const totalAnswered = studentAnalytics.reduce((sum, s) => sum + s.totalAnswered, 0);
    const totalPoints = studentAnalytics.reduce((sum, s) => sum + s.totalPoints, 0);

    return {
        totalStudents: totalPlayers,
        totalQuestions,
        averageScore: totalPlayers > 0
            ? Math.round((totalPoints / totalPlayers) * 100) / 100
            : 0,
        averageAccuracy: studentAnalytics.length > 0
            ? Math.round((studentAnalytics.reduce((sum, s) => sum + s.accuracy, 0) / studentAnalytics.length) * 100) / 100
            : 0,
        questionsNeedingReview: questionAnalytics.filter(q => q.needsReview).length,
        studentsNeedingAttention: studentAnalytics.filter(s => s.needsAttention).length,
        participationRate: totalPlayers > 0 && totalQuestions > 0
            ? Math.round((totalAnswered / (totalPlayers * totalQuestions)) * 100)
            : 0
    };
};

const generateAnalytics = ({ players, playerAnswers, questionHistory }) => {
    const questionAnalytics = generateQuestionAnalytics(playerAnswers, questionHistory);
    const studentAnalytics = generateStudentAnalytics(players, playerAnswers, questionHistory);
    const classAnalytics = generateClassAnalytics(
        studentAnalytics, questionAnalytics, players.length, playerAnswers.length
    );

    return { classAnalytics, questionAnalytics, studentAnalytics };
};

module.exports = {
    classifyAnswer,
    generateAnalytics
};
