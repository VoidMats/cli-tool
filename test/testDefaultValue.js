import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";


tap.test("== Test for successful flags with default values ==", async (t) => {
    let index = 1;
    let msg = "";

    msg = ` ${index} - ONE STRING FLAG - without equal sign and no default`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 0, "correct number of flags", cli.flags);
        t2.same(cli.flags, {}, "cli.flags contain correct values", cli.flags);
        console.log(cli.flags)
        console.log(cli._flags)
        if (t2.counts.fail > 0) printResult(cli);
    });

    msg = ` ${index} - ONE STRING FLAG - with empty equal sign and no default`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString="]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 0, "correct number of flags", cli.flags);
        t2.same(cli.flags, {}, "cli.flags contain correct values", cli.flags);
        console.log(cli._flags)
        if (t2.counts.fail > 0) printResult(cli);
    });


    msg = ` ${index} - ONE STRING FLAG - with empty equal sign and no default`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString=''"]); 
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_CONFIG);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 0, "correct number of flags", cli.flags);
        t2.same(cli.flags, {}, "cli.flags contain correct values", cli.flags);
        console.log(cli.flags)
        if (t2.counts.fail > 0) printResult(cli);
    });

    msg = ` ${index} - ONE STRING FLAG - without equal sign, but with default`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString"]); 
        const cli = new CliTool();
        const config = addConfig({ firstString: {
            type: "string",
            alias: "s",
            default: "FirstText",
            example: "FirstTestString"
        }});
        console.log(config)
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "FirstText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli);
    });

    msg = ` ${index} - ONE STRING FLAG - with empty equal sign, but with default`;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--firstString"]); 
        const cli = new CliTool();
        const config = addConfig({ firstString: {
            type: "string",
            alias: "s",
            default: "FirstText",
            example: "FirstTestString"
        }});
        cli.configureFlags(config);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) printResult(cli);
    });
});
