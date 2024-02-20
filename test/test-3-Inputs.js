import tap from "tap";
import { Parser } from "tap-parser";
import { INPUT_SUIT } from "./utils/constants.js";
import { runInput } from "./utils/utils.js";

let index = 1;

tap.test("== TEST FOR INPUT VALUES ==", async (t) => {
    for (const testCase of INPUT_SUIT) {
        await runInput(t, index, testCase);
        index++
    }
});

/*
const parser = new Parser(results => console.dir(results));
parser.on('pass', data => console.log('pass', data));
parser.on('fail', data => console.log('fail', data));

tap.test("OVEREXTEND WITH TWO INPUT WITH DETECTUNKNOWN OFF", async (t) => {
    const child = t.spawn(
        "node ./src/index.js", 
        ["firstString", false, 54.56, "./test/utils", "http://google.com", "overextend1", "overextend2"],
        {
            stdio: [null, "pipe", "inherit"]
        }
    );
    child.stdout.pipe(parser);
});
*/
