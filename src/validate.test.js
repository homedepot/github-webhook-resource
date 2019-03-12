const validate = require('./validate');
const Combinatorics = require('js-combinatorics');

describe('validate.env', () => {
    it('validates the minimum config', () => {
        const validConfig = {
            ATC_EXTERNAL_URL: '',
            BUILD_TEAM_NAME: '',
            BUILD_PIPELINE_NAME: ''
        };

        expect(() => validate.env(validConfig)).not.toThrow();
    });

    it('throws error on invalid config', () => {
        expect(() => validate.env(undefined)).toThrow();
    });

    it('checks for required fields', () => {
        const required = [
            'ATC_EXTERNAL_URL',
            'BUILD_TEAM_NAME',
            'BUILD_PIPELINE_NAME'
        ];

        // Generate configs each with 1 missing required field
        const invalidConfigs = Combinatorics.combination(required, required.length - 1);

        invalidConfigs.forEach(cmb => {
            // Convert generated fields to config object
            const config = cmb.reduce((obj, field) => {
                obj[field] = '';
                return obj;
            }, {});

            expect(() => validate.env(config)).toThrow();
        });
    });

    it('checks fields with string constraint', () => {
        const constrainedFields = [
            'ATC_EXTERNAL_URL',
            'BUILD_TEAM_NAME',
            'BUILD_PIPELINE_NAME'
        ];

        constrainedFields.forEach(field => {
            const config = {
                ATC_EXTERNAL_URL: '',
                BUILD_TEAM_NAME: '',
                BUILD_PIPELINE_NAME: ''
            };

            expect(() => validate.env(config)).not.toThrow();
            config[field] = null;
            expect(() => validate.env(config)).toThrow();
        });
    });
});

describe('validate.input', () => {
    it('validates the minimum config', () => {
        const validConfig = {
            source: {
                github_api: '',
                github_token: ''
            },
            params: {
                org: '',
                repo: '',
                resource_name: '',
                webhook_token: '',
                operation: 'create'
            }
        };

        expect(() => validate.config(validConfig)).not.toThrow();
    });

    it('throws error on invalid config', () => {
        expect(() => validate.config(undefined)).toThrow();
    });

    it('checks for required fields', () => {
        const required = [
            'source.github_api',
            'source.github_token',
            'params.org',
            'params.repo',
            'params.resource_name',
            'params.webhook_token',
            'params.operation',
        ];

        // Generate configs each with 1 missing required field
        const invalidConfigs = Combinatorics.combination(required, required.length - 1);

        invalidConfigs.forEach(cmb => {
            // Convert generated fields to config object
            const config = cmb.reduce((obj, field) => {
                const fieldsTree = field.split('.');
                obj[fieldsTree[0]] = {};
                obj[fieldsTree[0]][fieldsTree[1]] = '';
                return obj;
            }, {});

            expect(() => validate.config(config)).toThrow();
        });
    });

    it('checks fields with string constraint', () => {
        const constrainedFields = [
            'source.github_api',
            'source.github_token',
            'params.org',
            'params.repo',
            'params.resource_name',
            'params.webhook_token',
            'params.operation',
        ];

        constrainedFields.forEach(field => {
            const config = {
                source: {
                    github_api: '',
                    github_token: ''
                },
                params: {
                    org: '',
                    repo: '',
                    resource_name: '',
                    webhook_token: '',
                    operation: 'create'
                }
            };

            expect(() => validate.config(config)).not.toThrow();

            const fieldTree = field.split('.');
            config[fieldTree[0]][fieldTree[1]] = null;

            expect(() => validate.config(config)).toThrow();
        });
    });

    it('converts operation to lowercase', () => {
        const config = {
            source: {
                github_api: '',
                github_token: ''
            },
            params: {
                org: '',
                repo: '',
                resource_name: '',
                webhook_token: '',
                operation: 'CrEaTe'
            }
        };

        expect(() => validate.config(config)).not.toThrow();
        expect(config.params.operation).toBe('create');
    });

    it('trims whitespace from operation', () => {
        const config = {
            source: {
                github_api: '',
                github_token: ''
            },
            params: {
                org: '',
                repo: '',
                resource_name: '',
                webhook_token: '',
                operation: ' create '
            }
        };

        expect(() => validate.config(config)).not.toThrow();
        expect(config.params.operation).toBe('create');
    });

    it('checks fields with array constraint', () => {
        const constrainedFields = [
            'params.events'
        ];

        constrainedFields.forEach(field => {
            const config = {
                source: {
                    github_api: '',
                    github_token: ''
                },
                params: {
                    org: '',
                    repo: '',
                    resource_name: '',
                    webhook_token: '',
                    operation: 'create',
                    events: []
                }
            };

            expect(() => validate.config(config)).not.toThrow();

            const fieldTree = field.split('.');
            config[fieldTree[0]][fieldTree[1]] = null;

            expect(() => validate.config(config)).toThrow();
        });
    });
});
