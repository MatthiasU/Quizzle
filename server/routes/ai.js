const rateLimit = require('express-rate-limit');
const app = require('express').Router();
const { isConfigured, getProvider, getSupportedProviders } = require('../utils/ai');
const { generateUuid } = require('../utils/random');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    message: { message: "Zu viele Anfragen. Bitte versuche es später erneut." }
});

app.get('/status', (req, res) => {
    res.json({
        available: isConfigured(),
        providers: getSupportedProviders()
    });
});

app.post('/generate', limiter, async (req, res) => {
    if (!isConfigured()) {
        return res.status(503).json({ message: "KI ist nicht konfiguriert." });
    }

    const { topic, questionCount } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
        return res.status(400).json({ message: "Ein gültiges Thema ist erforderlich." });
    }

    if (topic.trim().length > 200) {
        return res.status(400).json({ message: "Thema darf maximal 200 Zeichen lang sein." });
    }

    if (questionCount !== undefined && (typeof questionCount !== 'number' || questionCount < 1 || questionCount > 50)) {
        return res.status(400).json({ message: "Fragenanzahl muss zwischen 1 und 50 liegen." });
    }

    const provider = getProvider();
    if (!provider) {
        return res.status(503).json({ message: "KI-Anbieter nicht verfügbar." });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    let fullText = '';
    let sentQuestions = 0;

    const tryExtractQuestions = () => {
        const questions = [];
        let searchText = fullText;

        try {
            const cleaned = searchText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}

        const cleaned = searchText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        let depth = 0;
        let start = -1;

        for (let i = 0; i < cleaned.length; i++) {
            const ch = cleaned[i];
            if (ch === '{' && depth === 0) {
                start = i;
                depth = 1;
            } else if (ch === '{') {
                depth++;
            } else if (ch === '}') {
                depth--;
                if (depth === 0 && start !== -1) {
                    try {
                        const obj = JSON.parse(cleaned.slice(start, i + 1));
                        if (obj.title && obj.type && obj.answers) {
                            questions.push(obj);
                        }
                    } catch (e) {}
                    start = -1;
                }
            }
        }

        return questions;
    };

    try {
        const stream = provider.generateStream(topic.trim(), questionCount);

        for await (const chunk of stream) {
            fullText += chunk;

            const questions = tryExtractQuestions();
            while (sentQuestions < questions.length) {
                const question = questions[sentQuestions];
                question.uuid = generateUuid();
                
                res.write(`data: ${JSON.stringify({ type: 'question', data: question })}\n\n`);
                sentQuestions++;
            }
        }

        const finalQuestions = tryExtractQuestions();
        while (sentQuestions < finalQuestions.length) {
            const question = finalQuestions[sentQuestions];
            question.uuid = generateUuid();
            res.write(`data: ${JSON.stringify({ type: 'question', data: question })}\n\n`);
            sentQuestions++;
        }

        res.write(`data: ${JSON.stringify({ type: 'done', total: sentQuestions })}\n\n`);
    } catch (error) {
        console.error('AI generation error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message || 'Fehler bei der Generierung.' })}\n\n`);
    }

    res.end();
});

module.exports = app;
