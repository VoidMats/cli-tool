import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";
import { 
    DEFAULT_FLAGS,
    resetProcessArgv,
    addConfig,
    checkInput
} from "./utils/utils.js";

let index = 1;

tap.test("== TEST FOR SUCCESSFUL DEFAULT VALUES ==", async (t) => {
    let msg = "";
    let input = [];

    // Test for flag type 'string'

    input = [""];
    msg = ` ${index} - ONE STRING FLAG`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstString: {
                type: "string",
                alias: 's',
                default: "SomeDefault",
                description: "Description for string"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "SomeDefault" }, "cli.flags contain correct values", cli.flags);
    });

    msg = ` ${index} - DEFAULT TWO STRING FLAG WITH STRING VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstString: {
                type: "string",
                alias: 's',
                default: "SomeDefault",
                description: "Description for first string"
            },
            secondString: {
                type: "string",
                alias: 'l',
                default: "56",
                description: "Description for second string"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "SomeDefault", secondString: "56" }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'number'

    msg = ` ${index} - DEFAULT NUMBER FLAG WITH STRING VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstNumber: {
                type: "number",
                alias: 'n',
                default: "4",
                description: "Description for first number"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 4 }, "cli.flags contain correct values", cli.flags);
    });

    msg = ` ${index} - DEFAULT NUMBER FLAG WITH NUMBER VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstNumber: {
                type: "number",
                alias: 'n',
                default: "4",
                description: "Description for first number"
            },
            secondNumber: {
                type: "number",
                alias: 'l',
                default: 8,
                description: "Description for second number"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 4, secondNumber: 8 }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'boolean' 

    msg = ` ${index} - DEFAULT BOOLEAN FLAG WITH STRING VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstBoolean: {
                type: "boolean",
                alias: 'b',
                default: "true",
                description: "Description for first number"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    msg = ` ${index} - DEFAULT BOOLEAN FLAG WITH BOOLEAN VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstBoolean: {
                type: "boolean",
                alias: 'b',
                default: "false",
                description: "Description for first number"
            },
            secondBoolean: {
                type: "boolean",
                alias: 'l',
                default: true,
                description: "Description for second number"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: false, secondBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    // Test default value for flag type 'path'

    msg = ` ${index} - DEFAULT PATH FLAG WITH STRING VALUE / argv: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, {
            firstPath: {
                type: "path",
                alias: 'p',
                default: "./test/file.txt",
                description: "Description for first path"
            }
        });
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstPath: {
            root: "",            
            dir: ".",            
            base: "test",        
            ext: "txt",             
            name: "test",        
            complete: "./test/file.txt"
        }}, "cli.flags contain correct values", cli.flags);
    });

});
