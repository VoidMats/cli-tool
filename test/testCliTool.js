import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";

const SAVED_PROCESS_ARGV = Array.from(process.argv);
const DEFAULT_CONFIG = {
    firstString: {
        type: "string",
        alias: "s",
        default: "first string",
        example: "FirstTestString"
    },
    firstBoolean: {
        type: "boolean",
        alias: "b",
        default: false,
        example: false
    },
    firstNumber: {
        type: "number",
        alias: "n",
        default: 0,
        example: 3
    },
}

const resetProcessArgv = (argv = []) => {
    const array = process.argv.slice(0, 2);
    return array.concat(argv);
}

const printResult = (cli, index) => {
    console.log(`==== ${index} Failed test report ====`);
    console.log("process.argv:");
    console.log(process.argv);
    console.log("----------------------------");
    console.log("cli._configFlags:");
    console.log(cli._configFlags);
    console.log("============================");
}

tap.test("== Test for successful flags", async (t) => {
    let index = 1;

    let msg = ` ${index} - One string flag`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=SomeText"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
        index++;
    });

    msg = ` ${index} - Two string flags`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=FirstText", "--secondString=SecondText"]); 
        const cli = new CliTool();
        const config = Object.assign(DEFAULT_CONFIG);
        config["secondString"] = {
            type: "string",
            alias: "l",
            default: "second string",
            example: "SecondTestString"
        };
        console.log(config)
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "FirstText", secondstring: "SecondText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
        index++;
    });

    msg = ` ${index} - One number flag`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstNumber=2"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstnumber: 2 }, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli, index);
        index++;
    });
});

tap.test("Check incomming config will set lower case", async (t) => {
    process.argv = resetProcessArgv(["--test"]); 
    //[...process.argv, "--test"];
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