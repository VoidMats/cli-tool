import process from "node:process";
import CliTool from "../../index.js";
import { DEFAULT_FLAGS, DEFAULT_INPUTS } from "./utils.js";

console.log(process.argv);
console.log(DEFAULT_FLAGS);
console.log(DEFAULT_INPUTS);

const cli = new CliTool("qwe", {detectUnknown: false}).parse(DEFAULT_INPUTS, DEFAULT_FLAGS);
console.log(cli._options)

console.log("== This the inputs ==");
console.log(cli.inputs);
console.log("== This the flags ==");
console.log(cli.flags);