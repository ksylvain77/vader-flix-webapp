const Joi = require('joi');

const schema = Joi.object({
    env: Joi.string().valid('development', 'production', 'test').required(),
    
    // Core application settings
    port: Joi.number().port().default(3000),
    cors: Joi.object({
        origin: Joi.string().required(),
        methods: Joi.array().items(Joi.string()).default(['GET', 'POST', 'PUT', 'DELETE']),
        credentials: Joi.boolean().default(true)
    }),

    // Services configuration
    services: Joi.object({
        database: Joi.object({
            host: Joi.string().required(),
            port: Joi.number().port().required(),
            name: Joi.string().required(),
            user: Joi.string().required(),
            password: Joi.string().required(),
            pool: Joi.object({
                max: Joi.number().min(1).default(10),
                min: Joi.number().min(0).default(0),
                acquire: Joi.number().min(1).default(30000),
                idle: Joi.number().min(1).default(10000)
            })
        }).required(),

        auth: Joi.object({
            jwtSecret: Joi.string().required(),
            tokenExpiration: Joi.string().default('1h'),
            passwordPolicy: Joi.object({
                minLength: Joi.number().min(8).default(8),
                requireNumbers: Joi.boolean().default(true),
                requireSpecialChars: Joi.boolean().default(true)
            })
        }).required(),

        plex: Joi.object({
            baseUrl: Joi.string().uri().required(),
            token: Joi.string().required(),
            librarySectionIds: Joi.array().items(Joi.number()).default([])
        }).required(),

        docker: Joi.object({
            containerPrefix: Joi.string().required(),
            nasIp: Joi.string().ip().required(),
            nasUser: Joi.string().required(),
            nasSshPort: Joi.number().port().default(22),
            projectPath: Joi.string().required()
        }).required()
    }).required()
});

module.exports = schema; 