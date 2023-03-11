import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";
import { DEFAULT_FLAGS, resetProcessArgv, addConfig } from "./utils/utils.js";

const SAVED_PROCESS_ARGV = Array.from(process.argv);

const checkInput = (cli, t) => {
    t.equal(cli.inputs.length, 0, "correct number of inputs", cli.inputs);
    t.same(cli.inputs, [], "cli.inputs contain correct values", cli.inputs);
}

let index = 1;

tap.test("== TEST FOR SUCCESSFUL FLAGS options: {detectUnknownFlags: false} ==", async (t) => {
    let msg = "";
    let input = [];

    input = ["--firstString=SomeText"];
    msg = ` ${index} ONE STRING FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "SomeText"}, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstString", "SomeText"];
    msg = ` ${index} ONE STRING FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "SomeText"}, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstString=FirstText", "--secondString=SecondText"];
    msg = ` ${index} TWO STRING FLAGS / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const config = addConfig(DEFAULT_FLAGS, { secondString: { 
            type: "string",
            alias: "l",
            default: "second string"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "FirstText", secondString: "SecondText"}, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstString", "FirstText", "--secondString", "SecondText"];
    msg = ` ${index} TWO STRING FLAGS / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const config = addConfig(DEFAULT_FLAGS, { secondString: { 
            type: "string",
            alias: "l",
            default: "second string"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "FirstText", secondString: "SecondText"}, "cli.flags contain correct values", cli.flags);
    });
    
    input = ["--firstString=FirstText", "--secondString=SecondText"];
    msg = ` ${index} TWO STRING FLAGS / input: ${input.join(' ')} / config for one flag`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstString: "FirstText" }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'number' 

    input = ["--firstNumber=2"]
    msg = ` ${index} ONE NUMBER FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 2 }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstNumber", "2"];
    msg = ` ${index} ONE NUMBER FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 2 }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstNumber=2", "--secondNumber=4"];
    msg = ` ${index} TWO NUMBER FLAG # input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input);
        const config = addConfig(DEFAULT_FLAGS, { secondNumber: { 
            type: "number",
            default: "second number"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 2, secondNumber: 4 }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstNumber", "2", "--secondNumber", "4"];
    msg = ` ${index} TWO NUMBER FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input);
        const config = addConfig(DEFAULT_FLAGS, { secondNumber: { 
            type: "number",
            default: "second number"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 2, secondNumber: 4 }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstNumber=2", "--secondNumber=4"];
    msg = ` ${index} TWO NUMBER FLAG # input: ${input.join(' ')} - config for one flag`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstNumber: 2 }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'boolean' 

    input = ["--firstBoolean=true"];
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean=True"];
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean", "true"];
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean=false"];
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: false }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean=False"]
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: false }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean", "false"];
    msg = ` ${index} ONE BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: false }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean=true", "--secondBoolean=false"];
    msg = ` ${index} TWO BOOLEAN FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const config = addConfig(DEFAULT_FLAGS, { secondNumber: { 
            type: "boolean",
            description: "second boolean"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstBoolean=true", "--secondBoolean=false"];
    msg = ` ${index} TWO BOOLEAN FLAG / input: ${input.join(' ')} / config for one flag`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstBoolean: true }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'path' 

    input = ["--firstPath=./test"];
    msg = ` ${index} ONE PATH FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstPath: {
            root: "",            
            dir: ".",            
            base: "test",        
            ext: "",             
            name: "test",        
            complete: "./test"
        }}, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstPath", "./test"];
    msg = ` ${index} ONE PATH FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstPath: {
            root: "",            
            dir: ".",            
            base: "test",        
            ext: "",             
            name: "test",        
            complete: "./test"
        }}, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstPath=./test", "--secondPath=./test/utils"];
    msg = ` ${index} TWO PATH FLAGS / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const config = addConfig(DEFAULT_FLAGS, { secondPath: { 
            type: "path",
            description: "second path flag"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { 
            firstPath: {
                root: "",            
                dir: ".",            
                base: "test",        
                ext: "",             
                name: "test",        
                complete: "./test"
            },
            secondPath: {
                root: "",            
                dir: "./test",            
                base: "utils",        
                ext: "",             
                name: "utils",        
                complete: "./test/utils"
            }
        }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstPath", "./test", "--secondPath", "./test/utils"];
    msg = ` ${index} TWO PATH FLAGS / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const config = addConfig(DEFAULT_FLAGS, { secondPath: { 
            type: "path",
            description: "second path flag"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { 
            firstPath: {
                root: "",            
                dir: ".",            
                base: "test",        
                ext: "",             
                name: "test",        
                complete: "./test"
            },
            secondPath: {
                root: "",            
                dir: "./test",            
                base: "utils",        
                ext: "",             
                name: "utils",        
                complete: "./test/utils"
            }
        }, "cli.flags contain correct values", cli.flags);
    });
    
    input = ["--firstPath=./test", "--secondPath=./test/utils"];
    msg = ` ${index} TWO PATH FLAGS / input: ${input.join(' ')} / config for one flag`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { 
            firstPath: {
                root: "",            
                dir: ".",            
                base: "test",        
                ext: "",             
                name: "test",        
                complete: "./test"
            }
        }, "cli.flags contain correct values", cli.flags);
    });

    // Test for flag type 'url' 

    input = ["--firstUrl=https://google.com"];
    msg = ` ${index} ONE URL FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstUrl: new URL("https://google.com") }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstUrl", "https://google.com"];
    msg = ` ${index} ONE URL FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input); 
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstUrl: new URL("https://google.com") }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstUrl=https://google.com", "--secondUrl=https://www.google.com/"];
    msg = ` ${index} TWO URL FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input);
        const config = addConfig(DEFAULT_FLAGS, { secondUrl: { 
            type: "url",
            description: "second url flag"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { 
            firstUrl: new URL("https://google.com"),
            secondUrl: new URL("https://www.google.com")
        }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstUrl", "https://google.com", "--secondUrl", "https://www.google.com/"];
    msg = ` ${index} TWO URL FLAG / input: ${input.join(' ')}`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input);
        const config = addConfig(DEFAULT_FLAGS, { secondUrl: { 
            type: "url",
            description: "second url flag"
        }});
        const cli = new CliTool().parse(null, config);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 2, "correct number of flags", cli.flags);
        t2.same(cli.flags, { 
            firstUrl: new URL("https://google.com"),
            secondUrl: new URL("https://www.google.com")
        }, "cli.flags contain correct values", cli.flags);
    });

    input = ["--firstUrl", "https://google.com", "--secondUrl", "https://www.google.com/"];
    msg = ` ${index} TWO URL FLAG / input: ${input.join(' ')} / config for one flag`;
    index++;
    await t.test(msg, async (t2) => {
        resetProcessArgv(input);
        const cli = new CliTool().parse(null, DEFAULT_FLAGS);
        checkInput(cli, t2);
        t2.equal(Object.keys(cli.flags).length, 1, "correct number of flags", cli.flags);
        t2.same(cli.flags, { firstUrl: new URL("https://google.com") }, "cli.flags contain correct values", cli.flags);
    });

});

tap.test("== Check incomming config will set lower case ==", async (t) => {
    resetProcessArgv(["--test"]);
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

// NB Because the second number does not have any config it ill be return as string
        //t2.same(cli.flags, { firstnumber: 2, secondnumber: '4' }, "cli.flags contain correct values", cli.flags);
*/