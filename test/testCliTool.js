import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";

tap.test("", async (t) => {
    process.argv = [...process.argv, "--test"];
    console.log(process.argv)
    const cli = new CliTool();
    cli.configureFlags();


});