
const run = (str) => {

}

const resetProcessArgv = (argv = []) => {
    const array = process.argv.slice(0, 2);
    return Array.from(array.concat(argv));
}

const DEFAULT_CONFIG = {
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
    }
};

const DEFAULT_INPUT = [
    {
        description: "input file",
    },
    {
        description: "output file"
    }
]

export {
    run,
    resetProcessArgv,
    DEFAULT_CONFIG,
    DEFAULT_INPUT
}
