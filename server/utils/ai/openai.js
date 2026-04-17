const AIProvider = require('./provider');

class OpenAIProvider extends AIProvider {
    constructor(config) {
        super(config);
        this.model = config.model || 'gpt-4o-mini';
    }

    async listModels() {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {'Authorization': `Bearer ${this.apiKey}`}
        });
        if (!response.ok) return [];
        const data = await response.json();
        const dominated = /\d{4}-\d{2}|preview|audio|realtime|search/;
        return (data.data || [])
            .map(m => m.id)
            .filter(id => /^(gpt-|o[1-9]|chatgpt-)/.test(id) && !dominated.test(id))
            .sort();
    }

    async *generateStream(topic, questionCount) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: this.getSystemPrompt() },
                    { role: 'user', content: this.getUserPrompt(topic, questionCount) }
                ],
                stream: true,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${error}`);
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

                const data = trimmed.slice(6);
                if (data === '[DONE]') return;

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) yield content;
                } catch (e) {}
            }
        }
    }
}

module.exports = OpenAIProvider;
