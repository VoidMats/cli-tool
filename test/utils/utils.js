import CliTool from "../../index.js";
import { spawn } from "child_process";

const resetProcessArgv = (argv = []) => {
    const array = process.argv.slice(0, 2);
    process.argv = Array.from(array.concat(argv));
}

const addConfig = (original, config = {}) => {
    const modefiedConfig = JSON.parse(JSON.stringify(original));
    for (const [k, v] of Object.entries(config)) modefiedConfig[k] = v;
    return modefiedConfig;
}

const checkInput = (cli, t) => {
    t.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
    t.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
}

const checkFlags = (cli, t) => {
    t.equal(Object.keys(cli.flags).length, 0, "correct number of flags", cli.flags);
    t.same(cli.flags, {}, "cli.flags contain correct value(s)", cli.flags);
}

const runRequired = async (t, index, testCase) => {
    await t.test(` ${index} - ${testCase.message}`, async (tt) => {
        resetProcessArgv(testCase.input);
        const proc = spawn(new CliTool().parse(testCase.config.input, testCase.config.flags), testCase.input)
        proc.on("error", (error) => {
            tt.error(error);
        });
        proc.on("close", (code) => {
            tt.equals(code, 1, "Flag 'firstString' is missing in cli command. Please refer to --help or -h.");
        });
    });
}

const runInput = async (t, index, testCase) => {
    await t.test(` ${index} - ${testCase.message}`, async (tt) => {
        resetProcessArgv(testCase.input);
        const cli = new CliTool().parse(testCase.config.input, testCase.config.flags);
        checkFlags(cli, tt);
        tt.equal(cli.inputs.length, testCase.result.length, "correct number of inputs", cli.input);
        tt.same(cli.inputs, testCase.result, "cli.input contain correct values");
    });
}

const DEFAULT_FLAGS = {
    firstString: {
        type: "string",
        alias: "s",
        description: "Description for a string",
    },
    firstBoolean: {
        type: "boolean",
        alias: "b",
        description: "Description for a boolean"
    },
    firstNumber: {
        type: "number",
        alias: "n",
        description: "Description for a number"
    },
    firstPath: {
        type: "path",
        alias: "p",
        description: "Description for a path"
    },
    firstUrl: {
        type: "url",
        alias: "u",
        description: "Description for a url"
    }
};

const DEFAULT_INPUTS = [
    {
        type: "string",
        description: "Description for an input string"
    },
    {
        type: "boolean",
        description: "Description for an input boolean"
    },
    {
        type: "number",
        description: "Description for an input number"
    },
    {
        type: "path",
        description: "Description for an input path"
    },
    {
        type: "url",
        description: "Description for an input url"
    }
]

export {
    resetProcessArgv,
    addConfig,
    checkInput,
    checkFlags,
    runRequired,
    runInput,
    DEFAULT_FLAGS,
    DEFAULT_INPUTS
}
