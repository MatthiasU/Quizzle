class AIProvider {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.model = config.model;
        this.baseUrl = config.baseUrl;
    }

    getSystemPrompt() {
        return `You are an expert quiz creator for Quizzle, an educational quiz platform. You generate quiz questions about a given topic.

You MUST respond with valid JSON only - no markdown, no explanation, no wrapping.

You support 4 question types:
1. "multiple-choice" — 2 to 6 answer options, each with "type": "text", "content": string, "is_correct": boolean. At least one must be correct.
2. "true-false" — exactly 2 answers: one with content "Wahr" and one "Falsch", each with "type": "text", "is_correct": boolean. Exactly one must be correct.
3. "text" — 1 to 10 accepted text answers, each with "content": string (the correct text answer).
4. "sequence" — 2 to 8 items that must be sorted in the correct order, each with "content": string, "order": number (1-based, representing the correct position).

Rules:
- Generate a varied mix of question types appropriate for the topic
- Question titles must be clear and concise (max 200 characters)
- Answer content must be max 150 characters
- Make questions educational and interesting
- Include some easy, medium, and hard questions
- All text should be in German
- Research the topic thoroughly and ensure factual accuracy

Respond with a JSON array where each element is a question object:
{
  "title": "Question text here?",
  "type": "multiple-choice|true-false|text|sequence",
  "answers": [...]
}

For multiple-choice answers: [{"type": "text", "content": "Answer", "is_correct": true/false}, ...]
For true-false answers: [{"type": "text", "content": "Wahr", "is_correct": true}, {"type": "text", "content": "Falsch", "is_correct": false}]
For text answers: [{"content": "accepted answer"}, ...]
For sequence answers: [{"content": "Item", "order": 1}, {"content": "Item", "order": 2}, ...]

Generate between 5 and 15 questions depending on how broad the topic is. Use your judgment on the right amount.`;
    }

    getUserPrompt(topic, questionCount) {
        let prompt = `Erstelle ein Quiz über das folgende Thema: "${topic}"`;
        if (questionCount) {
            prompt += `\n\nGeneriere genau ${questionCount} Fragen.`;
        }
        return prompt;
    }

    async *generateStream(topic, questionCount) {
        throw new Error('generateStream must be implemented by provider');
    }

    parseQuestions(text) {
        try {
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleaned);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return null;
        }
    }
}

module.exports = AIProvider;
