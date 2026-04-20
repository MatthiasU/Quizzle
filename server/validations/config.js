const Joi = require('joi');

module.exports.config = Joi.object({
    password: Joi.string().optional().allow(''),
    ai: Joi.object({
        provider: Joi.string().valid('openai', 'anthropic', 'google', 'ollama', '').optional().allow(''),
        apiKey: Joi.string().optional().allow(''),
        model: Joi.string().optional().allow(''),
        baseUrl: Joi.string().uri().optional().allow('')
    }).optional(),
    media: Joi.object({
        unsplashAccessKey: Joi.string().optional().allow(''),
        giphyApiKey: Joi.string().optional().allow('')
    }).optional()
}).options({allowUnknown: true});