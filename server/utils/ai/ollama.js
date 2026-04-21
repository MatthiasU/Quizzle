const AIProvider = require('./provider');

class OllamaProvider extends AIProvider {
    constructor(config) {
        super(config);
        this.baseUrl = config.baseUrl || 'http://localhost:11434';
        this.model = config.model || 'llama3';
    }

    async listModels() {
        const response = await fetch(`${this.baseUrl}/api/tags`);
        if (!response.ok) return [];
        const data = await response.json();
        return (data.models || []).map(m => m.name).sort();
    }

    async *generateStream(options) {
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: this.getSystemPrompt(options) },
                    { role: 'user', content: this.getUserPrompt(options) }
                ],
                stream: true,
                options: { temperature: options?.mode === 'metadata' ? 0.5 : 0.7 }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Ollama API error: ${response.status} - ${error}`);
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
                if (!trimmed) continue;

                try {
                    const parsed = JSON.parse(trimmed);
                    if (parsed.done) return;
                    const content = parsed.message?.content;
                    if (content) yield content;
                } catch (e) {}
            }
        }
    }
}

module.exports = OllamaProvider;
