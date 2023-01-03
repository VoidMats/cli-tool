import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";

const SAVED_PROCESS_ARGV = Array.from(process.argv);
const DEFAULT_CONFIG = {
    firstString: {
        type: "string",
        alias: "s",
        example: "FirstTestString"
    },
    firstBoolean: {
        type: "boolean",
        alias: "b",
        example: false
    },
    firstNumber: {
        type: "number",
        alias: "n",
        example: 3
    }
};

const resetProcessArgv = (argv = []) => {
    const array = process.argv.slice(0, 2);
    return Array.from(array.concat(argv));
}

const addConfig = (config = {}) => {
    const modefiedConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    for (const [k, v] of Object.entries(config)) modefiedConfig[k] = v;
    return modefiedConfig;
}

const printResult = (cli) => {
    console.log(`==== Failed test ====`);
    console.log("process.argv:");
    console.log(process.argv);
    console.log("----------------------------");
    console.log("cli._configFlags:");
    console.log(cli._configFlags);
    console.log("----------------------------");
    console.log("cli.flags:");
    console.log(cli.flags);
    console.log("============================");
}


tap.test("== Test for successful flags with detectUnknownFlags ==", async (t) => {
    let index = 1;
    let msg = "";

    msg = ` ${index} - ONE STRING FLAG`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=SomeText"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli);
    });

    msg = ` ${index} - TWO STRING FLAGS - detectUnknownFlags=false with config for two flags`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=FirstText", "--secondString=SecondText"]); 
        const cli = new CliTool({ detectUnknownFlags: false });
        const config = addConfig({ secondString: { 
            type: "string",
            alias: "l",
            default: "second string",
            example: "SecondTestString"
        }});
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "FirstText", secondstring: "SecondText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });
    
    msg = ` ${index} - TWO STRING FLAGS - detectUnknownFlags=false with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=FirstText", "--secondString=SecondText"]); 
        const cli = new CliTool({ detectUnknownFlags: false });
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "FirstText" }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO STRING FLAGS - detectUnknownFlags=true with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=FirstText", "--secondString=SecondText"]); 
        const cli = new CliTool({ detectUnknownFlags: true });
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "FirstText", secondstring: "SecondText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - ONE NUMBER FLAG`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstNumber=2"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstnumber: 2 }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO NUMBER FLAG - detectUnknownFlags=false with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstNumber=2", "--secondNumber=4"]); 
        const cli = new CliTool({ detectUnknownFlags: false });
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstnumber: 2 }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO NUMBER FLAG - detectUnknownFlags=true with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstNumber=2", "--secondNumber=4"]); 
        const cli = new CliTool({ detectUnknownFlags: true });
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        // NB Because the second number does not have any config it ill be return as string
        t2.same(cli.flags, { firstnumber: 2, secondnumber: '4' }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO NUMBER FLAG - detectUnknownFlags=false with config for two flags`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstNumber=2", "--secondNumber=4"]); 
        const cli = new CliTool({ detectUnknownFlags: false });
        const config = addConfig({ secondNumber: { 
            type: "number",
            alias: "l",
            default: 0,
            example: 4
        }});
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstnumber: 2, secondnumber: 4 }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - ONE BOOLEAN FLAG`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstBoolean=true"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstboolean: true }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO BOOLEAN FLAG - detectUnknownFlags=false with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstBoolean=true", "--secondBoolean=false"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstboolean: true }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO BOOLEAN FLAG - detectUnknownFlags=true with config for one flag`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstBoolean=true", "--secondBoolean=false"]); 
        const cli = new CliTool({ detectUnknownFlags: true });
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        // NB Because the second boolean does not have any config it ill be return as string
        t2.same(cli.flags, { firstboolean: true, secondboolean: 'false' }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

    msg = ` ${index} - TWO BOOLEAN FLAG - detectUnknownFlags=false with config for two flags`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstBoolean=true", "--secondBoolean=false"]); 
        const cli = new CliTool();
        const config = addConfig({ secondBoolean: { 
            type: "boolean",
            alias: "l",
            default: false,
            example: false
        }});
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstboolean: true, secondboolean: false }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
    });

});

tap.test("== Check incomming config will set lower case ==", async (t) => {
    process.argv = resetProcessArgv(["--test"]);
    console.log(process.argv)
    const cli = new CliTool();
    cli.configureFlags({
        Test: {
            Type: "string"
        },
        test2: {
            type: "string"
        }
    });
    t.ok(Object.keys(cli._configFlags.test).includes("type"), "");
    if (t.counts.fail > 0) printResult(cli, 0);
});

tap.test("== Check if flag is missing when config require it ==", async (t) => {
    let index = 1;
    let msg = "";

    msg = ` ${index} - ONE STRING FLAG - with empty equal sign, but with default`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString"]); 
        const cli = new CliTool();
        const config = addConfig({ secondString: {
            type: "string",
            alias: "s",
            default: "SecondText",
            required: true,
            example: "SecondTestString"
        }});
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli);
    });
});

/*
tap.test("", async (t) => {
    //process.argv = [...process.argv, "--flagString=asdas"];
    resetProcessArgv();
    console.log(process.argv)
    const cli = new CliTool();
    cli.configureFlags({
        test: {
            type: "string"
        }
    });
});
*/