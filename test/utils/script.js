import process from "node:process";
import CliTool from "../../index.js";
import { DEFAULT_FLAGS, DEFAULT_INPUTS } from "./utils.js";

console.log(process.argv);
console.log(DEFAULT_FLAGS);
console.log(DEFAULT_INPUTS);

const cli = new CliTool("This is a help script to check performance of the cli-tool.");
cli.configureFlags({
    firstPath: {
        type: "path",
        default: "../testDefaultValue.js"
    }
});
cli.parse();
console.log(cli._options);

console.log("== This the inputs ==");
console.log(cli.inputs);
console.log("== This the flags ==");
console.log(cli.flags);