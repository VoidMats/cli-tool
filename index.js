import process from "node:process";
import * as url from "url";
import path from "node:path";
import fs from "node:fs";
import { URL } from "node:url";
import argvParser from "minimist";

const __dirname = url.fileURLToPath(import.meta.url);
const __filename = path.basename(__dirname);

/**
 * TODO 
 * - Validate options
 * - Write help text
 *    - Write options text
 *    - Write usage text
 * - Remove all exceptions. Replace with process.exit(this._exitCode) 
 * - Check for required flags
 * - check for required inputs
 * - Check that config.type = number actually is a number
 * - Write test for mixed input and flags
 * - Write test for detectPackage
 * - Write test for flags without value as boolean
 * - Write test for default values 
 * - Write test for alias
 * - Write test for flags with next incomming input
 * - Write test for help text
 * - Split tests into boolean, string, number
 * - Add argument type Date
 * - Add argument type Url
 * - Add option case sensative
 * - Add function verbose
 * - Write README
 **/

/**
 * 
 */
export default class CliTool {

    /**
     * 
     * @param { String } description
     * @param { Object } options 
     */
    constructor(description, options = {}) {
        this._description = description;
        this._options = {
            disableColors: (process.env.NODE_DISABLE_COLORS) ? process.env.NODE_DISABLE_COLORS : false,
            detectPackage: true,
            detectUnknown: true,
            exitCode: 0,
            ...options
        }
        this._application = {
            name:  __filename
        };
        this._argv = process.argv.slice(2);
        this._configFlags = {};
        this._configInputs = [];
        this._flags = {};
        this._inputs = [];
        this._settings = {
            verbose: false
        }
        this._POSSIBLE_TYPES = [
            "string",
            "boolean",
            "number",
            "path",
            "url"
        ];

        if (this._options.detectPackage) this._loadPackageJson();
    }

    /**
     * The flags can be configured as following: 
     * {
     *      all: {
     *          type: [boolean, string, number, path, url],
     *          alias: 'a' or '-a',
     *          description: 'Text shown in example',
     *          default: 'This is default value of the flag',
     *          required: true | false
     *      } 
     * }
     * @param { Object } config 
     */
    configureFlags(config) {
        this._configFlags = {};
        for (let [flagKey, flagValue] of Object.entries(config)) {
            const updatedFlagKey = flagKey.toLowerCase();
            let updatedFlagValue = {}
            for (const [attr, value] of Object.entries(flagValue)) {
                const updatedAttr = attr.toLowerCase();
                if (updatedAttr === "alias" && value.startsWith('-') ) value.slice(1);
                updatedFlagValue[updatedAttr] = value;
            }
            if (!Object.keys(updatedFlagValue).includes("type")) throw new Error(`The flag must belong to a type. Possible types are '${this._POSSIBLE_TYPES.join(", ")}'`);
            if (!this._POSSIBLE_TYPES.includes(updatedFlagValue.type)) throw new Error(`Flag contain a type which are not supported by the tool. `);
            this._configFlags[updatedFlagKey] = updatedFlagValue;
        }
    }

    /**
     * All configurations for the input/commands are order dependent
     * The input can be configured as following:
     * [
     *      {
     *          type: [string, boolean, string, number, path, url],
     *          description: "This is the path for the input file",
     *          default: "./inputfile.json",
     *          required: true | false
     *      } 
     * ]
     * Note that configuration of inputs must be as an Array and its order specific [{description: "input1", ...}, {description: "input2", ...} ].
     * @param { Object } config 
     */
    configureInputs(config) {
        this._configInputs = [];
        for (const input of config) {
            let updatedInputValue = {};
            for (const [attr, value] of Object.entries(input)) {
                const updatedAttr = attr.toLowerCase();
                if (["description", "default", "required", "type"].includes(updatedAttr)) {
                    updatedInputValue[updatedAttr] = value;
                }
            }
            this._configInputs.push(updatedInputValue);
        }
    }

    parse(configInput, configFlag) {
        if (!this._configInputs && configInput) this.configureInputs(configInput);
        if (!this._configFlags && configFlag) this.configureFlags(configFlag);
        // Done with configuration. Parse arguments and validate them
        const parsed = argvParser(this._argv);
        this._inputs = Array.from(parsed._);
        delete parsed._;
        this._flags = parsed;
        this._validateForHelp();
        this._validateFlags();
        this._validateInputs();
        return this;
    }

    _validateFlags() {
        const copyFlags = [];
        for (const [flag, conf] of Object.entries(this._configFlags)) {
            if (conf.alias) {
                if (!this._flags[flag]) this._flags[flag] = this._flags[conf.alias];
                delete this._flags[conf.alias];
            }
            if (conf.default && !this._flags[flag]) {
                this._flags[flag] = conf.default;
            }
            if (conf.required && !this._flags[flag]) {
                console.log(`Flag '${flag}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            }
            if (conf.type === "path" && !fs.existsSync(this._flags[flag])) {
                console.log(`Flag '${flag}' has none valid path. Please refer to --help or -h.\n`);
                this.showHelp();
            }
            if (conf.type === "url") {
                try {
                    new URL(this._flags[flag]);
                } catch (error) {
                    console.log(`Flag '${flag}' has none valid url. Please refer to --help or -h.\n`);
                    console.log(error.message);
                }
            }
            this._flags[flag] = this._correctValue(conf.type, this._flags[flag]);
            copyFlags.push(flag);
        }
        if (!this._options.detectUnknown) {
            copyFlags.forEach(f => {
                if (!this._flags[f]) delete this._flags[f]; 
            });
        }
    }

    _validateInputs() {
        const copyInputs = [];
        for (let i = 0; i < this._configInputs.length; i++ ) {
            const config = this._configInputs[i];
            copyInputs.push()
            if (config.default && this._inputs[i]) {
                this._inputs[i] = config.default;
            }
            if (config.required && this._inputs[i]) {
                console.log(`Input '${i + 1}'  with value '${this._inputs[i]}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            }
            if (config.type === "path" && !fs.existsSync(this._inputs[i])) {
                console.log(`Input '${i + 1}' with value '${this._inputs[i]}' has none valid path. Please refer to --help or -h. \n`);
                this.showHelp();
            }
            if (conf.type === "url") {
                try {
                    new URL(this._inputs[i]);
                } catch (error) {
                    console.log(`Input '${i + 1}' with value '${this._inputs[i]}' has none valid url. Please refer to --help or -h.\n`);
                    console.log(error.message);
                }
            }
            this._inputs[i] = this._correctValue(config.type, this._inputs[i]);
            copyInputs.push(i)
        }
        if (!this._options.detectUnknown) {
            copyInputs.forEach(i => {
                if (!this._inputs[i]) this._inputs.splice(i, 1);
            });
        }
    }

    _validateForHelp() {
        for (const [flag, value] of Object.entries(this._flags)) {
            if (flag === "h" || flag === "help") this.showHelp();
        }
    }

    _enterResult(result, hasConfig = true) {
        if (hasConfig) this._enterValue(result);
        if (this._options.detectUnknown) this._enterValue(result);
    }

    _correctValue(type, value) {
        if (['', null, undefined].includes(value)) return undefined;
        switch(type) {
            case "string":
            case "number":
                return value;
            case "boolean":
                try {
                    return JSON.parse((value.toLowerCase()));
                } catch (error) {
                    console.error(error.message);
                    process.exit(this._exitCode);
                }
            case "path":
                const pathObj = path.parse(value);
                pathObj["complete"] = value;
                return pathObj;
            case "url":
                return new URL(value);
            default:
                return value;
        }
    }

    _loadPackageJson() {
        [`${__dirname}/package.json`, `${__dirname}/../package.json`, `${__dirname}/../../package.json`].some(path => {
            try {
                const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
                this._application = {
                    name: json.name, 
                    version: json.version
                };
            } catch (error) {} // nope
        });
        if (!this._application) {
            console.error(`Can't detect version from package.json`);
        }
    }

    _createHelpText() {
        if (this._application.name) console.log(`\n    ${this._application.name.toUpperCase()}`);
        if (this._application.version) console.log(`    Version: ${this._application.version}`);
        if (!this._options.disableColors) {
            console.log("\x1b[45m Usage: \x1b[0m", '\n'); // Magneta
            console.log(this._description, '\n');
            console.log(`\t $\x1b[35m node ${this._application.name} \x1b[36m<commands>\x1b[90m [options] \x1b[0m\n`);
            console.log("\x1b[46m Commands: \x1b[0m"); // Cyan
            this._createTextInputs();
            console.log("\x1b[100m Options: \x1b[0m"); // Grey
            this._createTextOptions();
        } else {
            console.log("Usage: ");
            console.log(this._description, '\n');
            console.log(`\t $ node ${this._application.name} <commands> [options] \n`);
            console.log("Commands/Inputs: ");
            this._createTextInputs();
            console.log("Options: ");
            this._createTextOptions();
        }
    }

    _createTextOptions() {
        for (const [key, config] of Object.entries(this._configFlags)) {
            let option = `\t --${key}\t${(config.alias) ? `-${config.alias}` : ""}\t`;
            if (config.description) option += config.description;
            if (config.default) option += ` [${config.default}]`;
            console.log(option);
        }
        console.log('\n');
    }

    _createTextInputs() {
        console.log(this._configInputs)
        for (let i = 0; i < this._configInputs.length; i++) {
            const config = this._configInputs[i];
            let input = `\t$ ${this._application.name} <${(config.name ? config.name : "input_" + i+1)}>`;
            if (config.description) input += `\t ${config.description}`;
            if (config.default) input += ` [${config.default}]`; 
            console.log(input);
        }
        console.log(`\t ${this._application.name} \t-h | --help \t This text`);
        console.log('\n');
    }

    showHelp() {
        this._createHelpText();
        process.exit(this._exitCode);
    }

    verbose() {
        if (this._settings.verbose) {
            console.log(...arguments);
        }
    }

    debug() {
        console.dir(this._inputs, {depth: null});
        console.dir(this._flags, {depth: null});
    }

    get inputs() { return this._inputs; }
    get flags() { return this._flags; }
    get help() { return this.showHelp(); }
}