const path = require('path');
const { brandingFolder } = require('../file');

const OpenAIProvider = require('./openai');
const AnthropicProvider = require('./anthropic');
const GoogleProvider = require('./google');
const OllamaProvider = require('./ollama');

const PROVIDERS = {
    openai: OpenAIProvider,
    anthropic: AnthropicProvider,
    google: GoogleProvider,
    ollama: OllamaProvider
};

const KEYLESS_PROVIDERS = new Set(['ollama']);

const getAIConfig = () => {
    delete require.cache[require.resolve(path.join(brandingFolder, 'config.json'))];
    const config = require(path.join(brandingFolder, 'config.json'));
    return config.ai || null;
};

const isConfigured = () => {
    const aiConfig = getAIConfig();
    if (!aiConfig || !aiConfig.provider) return false;
    return KEYLESS_PROVIDERS.has(aiConfig.provider) || !!aiConfig.apiKey;
};

const getProvider = () => {
    const aiConfig = getAIConfig();
    if (!aiConfig || !aiConfig.provider) return null;
    if (!KEYLESS_PROVIDERS.has(aiConfig.provider) && !aiConfig.apiKey) return null;

    const ProviderClass = PROVIDERS[aiConfig.provider];
    if (!ProviderClass) return null;

    return new ProviderClass(aiConfig);
};

const getSupportedProviders = () => Object.keys(PROVIDERS);

module.exports = { getProvider, isConfigured, getAIConfig, getSupportedProviders };
