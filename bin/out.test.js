const out = require('./out');

describe('buildInstanceVaribles', () => {

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules()
        delete process.env.BUILD_PIPELINE_INSTANCE_VARS;
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    it('with undefined variables, returns empty string', () => {
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual('')
    });

    it('with no variables, returns empty string', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = "{}";
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual('')
    });

    it('with bad json, it throws an exception', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = "{695988";
        expect(() => out.buildInstanceVariables()).toThrow();
    });

    it('with valid instance variables, it builds variable string to append to url', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = '{"name":"John", "age":30, "car":"Toyota"}';
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual(`&vars.name="John"&vars.age="30"&vars.car="Toyota"`)
    });
});
