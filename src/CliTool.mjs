import process from "node:process";
import * as url from "url";
import path from "node:path";
import fs from "node:fs";
import { URL } from "node:url";
import argvParser from "minimist";
import { CliException, CliHelpException } from "./CliExceptions.mjs";
import CliHelp from "./CliHelp.mjs";

const __dirname = url.fileURLToPath(import.meta.url);
const __filename = path.basename(__dirname);

export default class CliTool {

    /**
     * 
     * @constructor
     * @param { Object } options 
     */
    constructor(options = {}) {
        this._description;
        this._options = {
            disableColors: (process.env.NODE_DISABLE_COLORS) ? process.env.NODE_DISABLE_COLORS : false,
            detectPackage: true,
            detectUnknown: false,
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
        this._POSSIBLE_TYPES = Object.freeze([
            "string",
            "boolean",
            "number",
            "path",
            "url"
        ]);

        if (this._options.detectPackage) this._loadPackageJson();
        return this;
    }

    /**
     * The flags can be configured as following: 
     * {
     *      test: {
     *          type: [boolean, string, number, path, url],
     *          alias: 't' or '-t',
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
            let updatedFlagValue = {}
            for (const [attribute, value] of Object.entries(flagValue)) {
                const attr = attribute.toLowerCase();
                switch(attr) {
                    case "alias":
                        if (value.startsWith('-')) updatedFlagValue[attr] = value.slice(1);
                        else updatedFlagValue[attr] = value;
                        break;
                    case "required":
                        const boolean = this._validateBoolean(value);
                        updatedFlagValue[attr] = boolean;
                        break;
                    case "type":
                        if (!this._POSSIBLE_TYPES.includes(value.toLowerCase())) {
                            throw new CliException(this._options.exitCode, `Flag contain a 'type' (${attr}) which are not supported by the cli-tool.`);
                        }
                        updatedFlagValue[attr] = value.toLowerCase();
                        break;
                    case "default":
                    case "description":
                        updatedFlagValue[attr] = value;
                        break;
                    default:
                        continue;
                }
            }
            // Check that the config at least have a valid 'type'  
            if (!Object.keys(updatedFlagValue).includes("type")) throw new Error(`The flag must belong to a type. Possible types are '${this._POSSIBLE_TYPES.join(", ")}'`);
            this._configFlags[flagKey] = updatedFlagValue;
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

    /**
     * 
     * @param { Object } configInput 
     * @param { Object } configFlag 
     * @param { String } description
     * @returns 
     */
    parse(configInput, configFlag) {
        if (!Object.keys(this._configInputs).length && configInput) this.configureInputs(configInput);
        if (!Object.keys(this._configFlags).length && configFlag) this.configureFlags(configFlag);
        const parsed = argvParser(this._argv, { string: true });
        this._inputs = Array.from(parsed._);
        delete parsed._;
        this._flags = parsed;
        this._validateForHelp();
        this._validateFlags();
        this._validateInputs();
        this._help = new CliHelp().createHelpText(this);
        return this;
    }

    _validateFlags() {
        const validatedFlags = {};
        for (const [flag, conf] of Object.entries(this._configFlags)) {
            if (conf.alias) {
                if (!this._flags[flag]) this._flags[flag] = this._flags[conf.alias];
                delete this._flags[conf.alias];
            }
            if (conf.hasOwnProperty("default") && !this._flags[flag]) {
                this._flags[flag] = conf.default;
            }
            if (conf.required && !this._flags[flag]) {
                throw new CliException(this._options.exitCode, `Flag '${flag}' is missing in cli command. Please refer to --help or -h. \n`);
            }
            if (conf.type === "path" && this._flags[flag]) {
                if (typeof this._flags[flag] === "string" || this._flags[flag] instanceof String) {
                    if (!fs.existsSync(this._flags[flag])) {
                        throw new CliHelpException(this._options.exitCode, `Flag '${flag}' has none valid path '${this._flags[flag]}'. Please refer to --help or -h. \n`);
                    }
                } else {
                    throw new CliException(this._options.exitCode, `Default flag value for '${flag}' has to be a string. Please change config for flags.`);
                }
                
            }
            if (conf.type === "url" && this._flags[flag]) {
                try {
                    new URL(this._flags[flag]);
                } catch (error) {
                    console.log(`Flag '${flag}' has none valid url. Please refer to --help or -h.\n`);
                    console.log(error.message);
                }
            }
            const value = this._correctValue(conf.type, this._flags[flag]);
            if (value !== undefined) validatedFlags[flag] = value;
        }
        if (this._options.detectUnknown) {
            for (const [flag, value] of Object.entries(this._flags)) {
                if (!this._configFlags[flag]) {
                    validatedFlags[flag] = value;
                }
            }
        }
        this._flags = validatedFlags;
    }

    _validateInputs() {
        const validateInputs = [];
        for (let i = 0; i < this._configInputs.length; i++ ) {
            const config = this._configInputs[i];
            if (config.default && this._inputs[i]) {
                this._inputs[i] = config.default;
            }
            if (config.required && this._inputs[i]) {
                console.log(`Input '${i + 1}'  with value '${this._inputs[i]}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            }
            if (config.type === "path" && this._inputs[i] && !fs.existsSync(this._inputs[i])) {
                console.log(`Input '${i + 1}' with value '${this._inputs[i]}' has none valid path. Please refer to --help or -h. \n`);
                this.showHelp();
            }
            if (config.type === "url" && this._inputs[i]) {
                try {
                    new URL(this._inputs[i]);
                } catch (error) {
                    console.log(`Input '${i + 1}' with value '${this._inputs[i]}' has none valid url. Please refer to --help or -h.\n`);
                    console.log(error.message);
                }
            }
            const value = this._correctValue(config.type, this._inputs[i]);
            if (value !== undefined) validateInputs.push(value);
        }
        this._inputs = validateInputs;
        if (!this._options.detectUnknown) {
            this._inputs.slice(this._configInputs.length-1, (this._inputs.length - this._configInputs.length));
        }
    }

    _validateForHelp() {
        for (const [flag, value] of Object.entries(this._flags)) {
            if (flag === "h" || flag === "help") {
                this.showHelp();
            }
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
                return String(value);
            case "number":
                return Number(value);
            case "boolean":
                return this._validateBoolean(value);
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

    _validatePath(path, type = "path") {
        if (path === undefined) return false;
        try {
            switch(type) {
                case "file":
                    return fs.statSync(path).isFile();
                case "folder":
                    return fs.statSync(path).isDirectory();
                default:
                    throw new Error("Wrong type ")
            }
        } catch(error) {
            if (error.code == "ENOENT") return false;
            throw error;
        }
    }

    _validateBoolean(value) {
        try {
            if (typeof value === "string" || value instanceof String) return JSON.parse(value.toLowerCase());
            return JSON.parse(value);
        } catch (error) {
            throw new CliException(this._options.exitCode, `Boolean value got an unvalid value: ${value}`);
        }
    }

    _loadPackageJson() {
        [`${__dirname}/package.json`, `${__dirname}/../package.json`, `${__dirname}/../../package.json`].some(path => {
            try {
                // Read package.json for version and name  
                const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
                this._application = {
                    name: json.name, 
                    version: json.version
                };
                // Try to read the description of package.json if missed by user
                if (this._description === undefined || this._description === "") {
                    this._description = json.description;
                }
            } catch (error) {} // nope
        });
        if (!this._application) {
            console.error(`Can't detect version from package.json`);
        }
    }

    _createHelpText() {
        if (this._application.name) console.log(`\n ${this._application.name.toUpperCase()}`);
        if (this._application.version) console.log(` Version: ${this._application.version}\n`);
        if (!this._options.disableColors) {
            console.log("\x1b[45m Usage: \x1b[0m", '\n'); // Magneta
            console.log(this._description, '\n');
            console.log(`\t $\x1b[35m node ${this._application.name} \x1b[36m<commands>\x1b[90m [options] \x1b[0m \n`);
            console.log("\n\x1b[46m Commands: \x1b[0m"); // Cyan
            this._createTextInputs();
            console.log("\n\x1b[100m Options: \x1b[0m"); // Grey
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
        console.log(`\t --help \t-h \tThis text`);
        console.log('\n');
    }

    _createTextInputs() {
        for (let i = 0; i < this._configInputs.length; i++) {
            const config = this._configInputs[i];
            let input = `\t$ ${this._application.name} <${(config.name ? config.name : "input_" + i+1)}>`;
            if (config.description) input += `\t ${config.description}`;
            if (config.default) input += ` [${config.default}]`; 
            console.log(input);
        }
        console.log('\n');
    }

    _exit(message, code = this._options.exitCode) {
        console.log(message);
        process.exit(code)
    }

    showHelp() {
        console.log(this._help);
        process.exit(this._options.exitCode);
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