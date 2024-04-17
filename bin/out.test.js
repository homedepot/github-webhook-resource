const out = require('./out');

describe('out', () => {

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules()
        delete process.env.BUILD_PIPELINE_INSTANCE_VARS;
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    describe('buildInstanceVaribles', () => {
        it('with unset variables, returns empty string', () => {
            delete process.env.BUILD_PIPELINE_INSTANCE_VARS;
            const params = {};
            const instanceVar = out.buildInstanceVariables(params);
            expect(instanceVar).toEqual('')
        });
    
        it('with empty variables, returns empty string', () => {
            process.env.BUILD_PIPELINE_INSTANCE_VARS = "{}";
            const params = {pipeline_instance_vars: {}};
            const instanceVar = out.buildInstanceVariables(params);
            expect(instanceVar).toEqual('')
        });
    
        it('with bad json, it throws an exception', () => {
            process.env.BUILD_PIPELINE_INSTANCE_VARS = "{695988";
            const params = {};
            expect(() => out.buildInstanceVariables(params)).toThrow();
        });
    
        it('with valid instance variables, it builds variable string to append to url', () => {
            process.env.BUILD_PIPELINE_INSTANCE_VARS = '{"name":"John", "age":30, "car":"Toyota"}';
            const params = {pipeline_instance_vars: {"license": "full"}};
            const instanceVar = out.buildInstanceVariables(params);
            expect(instanceVar).toEqual(`&vars.name="John"&vars.age="30"&vars.car="Toyota"&vars.license="full"`)
        });
    });

    describe('buildUrl', () => {
        it('defaults to using the concourse env vars', () => {
            process.env.ATC_EXTERNAL_URL = 'https://example.com';
            process.env.BUILD_PIPELINE_NAME = 'pipeline';
            process.env.BUILD_TEAM_NAME = 'team';
            const params = {
                resource_name: 'resource',
                webhook_token: 'token'
            }
            const instanceVar = out.buildUrl(null, params);
            expect(instanceVar).toEqual("https://example.com/api/v1/teams/team/pipelines/pipeline/resources/resource/check/webhook?webhook_token=token")
        });
      
        it('prefers the concourse vars from params', () => {
            process.env.ATC_EXTERNAL_URL = 'https://example.com';
            process.env.BUILD_PIPELINE_NAME = 'pipeline';
            process.env.BUILD_TEAM_NAME = 'team';
            const params = {
                pipeline: 'param-pipeline',
                payload_base_url: 'https://param-example.com',
                resource_name: 'resource',
                webhook_token: 'token'
            }
            const instanceVar = out.buildUrl(null, params);
            expect(instanceVar).toEqual("https://param-example.com/api/v1/teams/team/pipelines/param-pipeline/resources/resource/check/webhook?webhook_token=token")
        });
    });
});
