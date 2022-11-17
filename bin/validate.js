const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(ajv);
require('ajv-keywords')(ajv, 'transform');

const validOperations = ['create', 'delete'];

const envSchema = {
    type: 'object',
    properties: {
        ATC_EXTERNAL_URL:    { type: 'string' },
        BUILD_TEAM_NAME:     { type: 'string' },
        BUILD_PIPELINE_NAME: { type: 'string' },
        BUILD_PIPELINE_INSTANCE_VARS: { type: 'string' }
    },
    required: ['ATC_EXTERNAL_URL', 'BUILD_TEAM_NAME', 'BUILD_PIPELINE_NAME']
};

const configSchema = {
    type: 'object',
    properties: {
        source: {
            type: 'object',
            properties: {
                github_api:   { type: 'string' },
                github_token: { type: 'string' }
            },
            required: ['github_api', 'github_token']
        },
        params: {
            type: 'object',
            properties: {
                org:           { type: 'string' },
                repo:          { type: 'string' },
                resource_name: { type: 'string' },
                webhook_token: { type: 'string' },
                events:        {
                    type: 'array',
                    items: {
                        type: 'string',
                        transform: ['trim', 'toLowerCase']
                    }
                },
                operation:     {
                    type: 'string',
                    transform: ['trim', 'toEnumCase'],
                    enum: validOperations,
                    errorMessage: { enum: 'must be either create or delete' }
                },
                pipeline:      { 
                    type: 'string',
                    transform: ['trim', 'toLowerCase']
                },
                pipeline_instance_vars: { 
                    type: 'object',
                },
            },
            required: ['org', 'repo', 'resource_name', 'webhook_token', 'operation']
        },
    },
    required: ['source', 'params']
};

function env(env) {
    const test = ajv.compile(envSchema);
    const isValid = test(env);
    if (!isValid) fail(test);
}

function config(config) {
    const test = ajv.compile(configSchema);
    const isValid = test(config);
    if (!isValid) fail(test);
}

function fail(test) {
    let message = 'Invalid resource configuration:\n';

    test.errors.forEach(err => {
        message += `    ${err.dataPath.replace(/^\//, '')
                                      .replace(/\//g, '.')
                                      .replace(/.(\d+$)/, '[$1]')
                        || 'root configuration'} ${err.message}\n`;
    });

    throw new Error(message);
}

module.exports = { env, config };
