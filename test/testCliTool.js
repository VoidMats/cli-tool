import process from "node:process";
import tap from "tap";
import CliTool from "../index.js";

const printResult = () => {
    console.log();
}

tap.test("Check config set lower case flags", async (t) => {
    process.argv = [...process.argv, "--test"];
    const cli = new CliTool();
    cli.configureFlags({
        test: {
            Type: "string"
        },
        test2: {
            type: "string"
        }
    });
    //t.equal(cli.flags)
})

tap.test("", async (t) => {
    process.argv = [...process.argv, "--test"];
    console.log(process.argv)
    const cli = new CliTool();
    cli.configureFlags({
        test: {
            type: "string"
        }
    });


});