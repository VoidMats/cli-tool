
const run = (str) => {

}

const resetProcessArgv = (argv = []) => {
    const array = process.argv.slice(0, 2);
    return Array.from(array.concat(argv));
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
        alias: "-f",
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
    run,
    resetProcessArgv,
    DEFAULT_FLAGS,
    DEFAULT_INPUTS
}
