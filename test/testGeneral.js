import process from "node:process";
import tap from "tap";
import { CliTool } from "../src/index.js";
import { resetProcessArgv, DEFAULT_FLAGS, DEFAULT_INPUTS } from "./utils/utils.js";

tap.test("== ", async (t) => {
    let index = 1;

    
})

tap.test("== General test ==", async (t) => {
    let index = 1;
    let msg = "";

    msg = ` ${index} - TRIGGER HELP - alias -h with color`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["-h"]);
        const cli = new CliTool("Some description");
        cli.configureFlags(DEFAULT_FLAGS);
        cli.configureInputs(DEFAULT_INPUTS);
        //t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        //t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        //t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        //t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        //if (t2.counts.fail > 0) console.log(cli.flags);
    });

    msg = ` ${index} - TRIGGER HELP - flag --help with color`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["--help"]);
        const cli = new CliTool();
        cli.configureFlags(DEFAULT_FLAGS);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
    });

    msg = ` ${index} - TRIGGER HELP - alias -h without color`;
    index++;
    t.test(msg, async (t2) => {
        process.argv = resetProcessArgv(["-h"]);
        const cli = new CliTool("Some description");
        cli.configureFlags(DEFAULT_FLAGS);
        t2.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
        t2.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firststring: "SomeText"}, "cli.flags contain correct values", cli.flags);
        if (t2.counts.fail > 0) console.log(cli.flags);
    });
});