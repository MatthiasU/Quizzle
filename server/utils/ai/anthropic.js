const AIProvider = require('./provider');

class AnthropicProvider extends AIProvider {
    constructor(config) {
        super(config);
        this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
        this.model = config.model || 'claude-sonnet-4-20250514';
    }

    async *generateStream(topic, questionCount) {
        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: 8192,
                system: this.getSystemPrompt(),
                messages: [
                    { role: 'user', content: this.getUserPrompt(topic, questionCount) }
                ],
                stream: true,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${error}`);
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
                    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                        yield parsed.delta.text;
                    }
                    if (parsed.type === 'message_stop') return;
                } catch (e) {}
            }
        }
    }
}

module.exports = AnthropicProvider;
