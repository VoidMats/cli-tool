import { DEFAULT_INPUTS } from "./utils.js";

const REQUIRED_SUIT = Object.freeze(
    [
        {
            input: [""],
            message: "ONE STRING FLAG WITH REQUIRED",
            config: {
                input: null,
                flags: {
                    firstString: {
                        type: "string",
                        alias: "s",
                        required: true
                    }
                }
            },
            result: {

            }
        }
    ]
)

const INPUT_SUIT = Object.freeze(
    [
        {
            input: ["firstString"],
            message: "FIRST INPUT STRING",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: [
                "firstString"
            ]
        },
        {
            input: ["firstString", "false"],
            message: "SECOND INPUT BOOLEAN",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: [
                "firstString",
                false
            ]
        },
        {
            input: ["firstString", true, "4"],
            message: "THIRD INPUT NUMBER",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: [
                "firstString",
                true,
                4
            ]
        },
        {
            input: ["firstString", false, 54, "./test/testInput.js"],
            message: "FOURTH INPUT PATH",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: [
                "firstString",
                false,
                54,
                { root: "", dir: "./test", base: "testInput.js", ext: ".js", name: "testInput", complete: "./test/testInput.js" }
            ]
        },
        {
            input: ["firstString", false, 54.56, "./test/utils", "http://google.com"],
            message: "FIFTH INPUT URL",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: [
                "firstString",
                false,
                54.56,
                { root: "", dir: "./test", base: "utils", ext: "", name: "utils", complete: "./test/utils" },
                new URL("http://google.com")
            ]
        },
        {
            input: [],
            message: "NO INPUT",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: []
        }
    ]
)

/*
 {
            input: ["test1", "test2"],
            message: "WRONG INPUT ACCORDING TO CONFIG",
            config: {
                input: DEFAULT_INPUTS,
                flags: null
            },
            result: []
        },
*/

export {
    REQUIRED_SUIT,
    INPUT_SUIT
}