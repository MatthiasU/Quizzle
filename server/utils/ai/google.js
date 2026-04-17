const AIProvider = require('./provider');

class GoogleProvider extends AIProvider {
    constructor(config) {
        super(config);
        this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
        this.model = config.model || 'gemini-2.0-flash';
    }

    async *generateStream(topic, questionCount) {
        const url = `${this.baseUrl}/models/${this.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${this.getSystemPrompt()}\n\n${this.getUserPrompt(topic, questionCount)}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Google AI API error: ${response.status} - ${error}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data: ')) continue;

                try {
                    const parsed = JSON.parse(trimmed.slice(6));
                    const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) yield text;
                } catch (e) {}
            }
        }
    }
}

module.exports = GoogleProvider;
