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

    it('returns empty string when no variables', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = "{}";
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual('')
    });

    it('assumes no instance variable on exception', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = "695988";
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual('')
    });

    it('builds variable string to append to url', () => {
        process.env.BUILD_PIPELINE_INSTANCE_VARS = '{"name":"John", "age":30, "car":"Toyota"}';
        const instanceVar = out.buildInstanceVariables();
        expect(instanceVar).toEqual(`&vars.name="John"&vars.age="30"&vars.car="Toyota"`)
    });
});
