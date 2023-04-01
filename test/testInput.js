import tap from "tap";
import { INPUT_SUIT } from "./utils/constants.js";
import { runInput } from "./utils/utils.js";


let index = 1;

tap.test("== TEST FOR INPUT VALUES ==", async (t) => {

    for (const testCase of INPUT_SUIT) {
        await runInput(t, index, testCase);
        index++
    }
});