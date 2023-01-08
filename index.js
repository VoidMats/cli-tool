import process from "node:process";
import * as url from "url";
import path from "node:path";

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
 * - Write test for booleanDefault
 * - Write test for detectVersion
 * - Write test for flags without value as boolean
 * - Write test for default values 
 * - Write test for alias
 * - Write test for flags with next incomming input
 * - Write test for help text
 * - Split tests into boolean, string, number
 **/

export default class CliTool {

    /**
     * 
     * @param { Object } options 
     */
    constructor(description, options = {}) {
        this._description = description;
        this._options = {
            disableColors: (process.env.NODE_DISABLE_COLORS) ? process.env.NODE_DISABLE_COLORS : false,
            detectVersion: false,
            booleanDefault: false,
            detectUnknownFlags: false,
            exitCode: 0,
            ...options
        }
        this._applicationName = __filename;
        this._argv = process.argv.slice(2);
        this._configFlags = {};
        this._configInputs = [];
        this._flags = {};
        this._inputs = [];
        this._nextArgvBelongsToCurrent = undefined;
        this._possibleTypes = [
            "string",
            "boolean",
            "number"
        ];

        if (this._options.detectVersion) this._loadPackageJson();
    }

    /**
     * Method for adding config for both input and flags. 
     * 
     * @param { Object } configInput 
     * @param { Object } configFlag 
     */
    configure(configInput, configFlag) {
        this.configureInputs(configInput);
        this.configureFlags(configFlag);
    }

    /**
     * The flags can be configured as following: 
     * {
     *      help: {
     *          type: 'boolean',
     *          alias: 'h' or '-h',
     *          default: 'This is default text',
     *          description: 'Text shown in example',
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
            if (!Object.keys(updatedFlagValue).includes("type")) throw new Error(`The flag must belong to a type. Possible types are '${this._possibleTypes.join(", ")}'`);
            if (!this._possibleTypes.includes(updatedFlagValue.type)) throw new Error(`Flag contain a type which are not supported by the tool. `);
            this._configFlags[updatedFlagKey] = updatedFlagValue;
        }
        this._validation();
    }

    /**
     * The input can be configured as following:
     * [
     *      {
     *          name: "path",
     *          description: "This is the path for the input file",
     *          default: "./inputfile.json",
     *          required: true | false
     *      } 
     * ]
     * @param { Object } config 
     */
    configureInputs(config) {
        this._configInputs = [];
        for (const input of config) {
            let updatedInputValue = {}
            for (const [attr, value] of Object.entries(input)) {
                const updatedAttr = attr.toLowerCase();
                if (["description", "default", "required", "name"].includes(updatedAttr)) {
                    updatedInputValue[updatedAttr] = value;
                }
            }
            this._configInputs.push(updatedInputValue);
        }
        this._validation();
    }

    _validation() {
        this._validateArguments();
        if (Object.keys(this._configFlags).length !== 0) this._validateForRequiredFlags();
        if (Object.keys(this._configInputs).length !== 0) this._validateForRequiredInputs();
    }

    _validateArguments() {
        let readInputs = true;
        for (let i=0; i < this._argv.length; i++) {
            const arg = this._argv[i];
            const argNext = (i+1 < this._argv.length) ? this._argv[i+1] : undefined; 
            this._validateArgumentForHelp(arg);
            if (!this._validateArgumentForInput(arg)) {
                readInputs = false;
                if (this._validateArgumentForAlias(arg)) {
                    let result = this._validateArgumentForEqualSign(arg);
                    result[0] = this._findFlagFromAlias(result[0]);
                    this._enterResult(result);
                } else {
                    let result = this._validateArgumentForEqualSign(arg);
                    if (result[0].startsWith('--')) result[0] = result[0].slice(2);
                    const hasConfig = this._findConfigFromFlag(result[0])
                    //console.log(`${result.join(" - ")} = ${hasConfig}`)
                    this._enterResult(result, hasConfig);
                }   
            }
            if (readInputs) {
                this._inputs.push(arg);
                continue;
            } 
            if (!readInputs && this._nextArgvBelongsToCurrent) {
                this._flags[this._nextArgvBelongsToCurrent] = arg;
                this._nextArgvBelongsToCurrent = undefined;
            }
        }
        // Add default values for input
        if (this._inputs.length !== this._configInputs.length) {
            for (let i=this._inputs.length; i < this._configInputs.length; i++) {
                if (this._configInputs[i].default !== undefined) this._inputs[i] = this._configInputs.default;
            }
        }
    }

    _validateForRequiredFlags() {
        for (const [flag, conf] of Object.entries(this._configFlags)) {
            if (conf.required && !this._flags[flag]) {
                console.log(`Flag '${flag}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            } 
        }
    }

    _validateForRequiredInputs() {
        for (let i = 0; i < this._configInputs.length; i++ ) {
            if (input.required && this._inputs[i]) {
                console.log(`Input '${i + 1}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            } 
        }
    }

    // Methods for validation of argument

    _validateArgumentForHelp(arg) {
        if (arg === "-h" || arg === "--help") this.showHelp();
    }

    _validateArgumentForInput(arg) {
        const result = /^-{1,2}/.exec(arg);
        return (result) ? false : true; 
    }

    _validateArgumentForAlias(arg) {
        return (arg.startsWith("--")) ? false : true;
    }

    _validateArgumentForEqualSign(arg) {
        let checkForFlagResult = arg.split('=');
        if (checkForFlagResult.length === 1) {
            return [checkForFlagResult[0]];
        } else {
            //if ([null, ""].includes(checkForFlagResult[1])) checkForFlagResult[1] = undefined;
            return [checkForFlagResult[0].toLowerCase(), checkForFlagResult[1]];
        }
    }

    _findConfigFromFlag(flag) {
        return (this._configFlags[flag]) ? true : false;
    }

    _findFlagFromAlias(alias) {
        if (alias.startsWith('-')) alias.slice(1);
        for (let [flagKey, flagValue] of Object.entries(config)) {
            if (flagValue.alias === alias) return flagKey;
        }
        //throw new Error(`Unknow alias '-${alias}'. Please refer to help (-h or --help) for more info `)
    }

    _enterResult(result, hasConfig = true) {
        if (hasConfig) this._enterValue(result);
        if (this._options.detectUnknownFlags) this._enterValue(result);
    }

    _enterValue(result) {
        if (result.length === 1) {
            this._nextArgvBelongsToCurrent = result[0];
        } else {
            // Copy key and value to remove circular reference
            const copyFlag = `${result[0]}`;
            let copyValue = `${result[1]}`;
            switch(this._configFlags[copyFlag]?.type) {
                case "string":
                    if (['', null].includes(copyValue)) copyValue = undefined;
                    this._flags[copyFlag] = copyValue;
                    break;
                case "boolean":
                    try {
                        this._flags[copyFlag] = JSON.parse((copyValue.toLowerCase()));
                    } catch (error) {
                        console.error(error.message);
                        process.exit(this._exitCode);
                    }
                    break;
                case "number":
                    // Check that copyValue actually is a number
                    // TODO Hex number
                    this._flags[copyFlag] = Number(copyValue);
                    break;
                default:
                    // Beacuse config is missing or config type is wrong value will be passed as string
                    this._flags[copyFlag] = copyValue;
            }
        }
    }

    _loadPackageJson() {
        [`${__dirname}/package.json`, `${__dirname}/../package.json`, `${__dirname}/../../package.json`].some(path => {
            try {
                const json = JSON.parse(fs.readFileSync(path, 'utf-8'));
                this._applicationName = json.name;
                this._applicationVersion = json.version;
            } catch (error) {} // nope
        });
        if (!this._applicationVersion) {
            console.error(`Can't detect version from package.json`);
        }
    }

    _createHelpText() {
        if (!this._options.disableColors) {
            console.log("\x1b[45m Usage: \x1b[0m", '\n'); // Magneta
            console.log(this._description, '\n');
            console.log(`\t $\x1b[35m ${"asdas"} \x1b[36m<commands>\x1b[90m [options] \x1b[0m\n`);
            console.log("\x1b[46m Commands: \x1b[0m"); // Cyan
            this._createTextInputs();
            console.log("\x1b[100m Options: \x1b[0m"); // Grey
            this._createTextOptions();
        } else {
            console.log("Usage: ");
            console.log(this._description, '\n');
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
            let input = `\t$ ${this._applicationName} <${(config.name ? config.name : "input_" + i+1)}>`;
            if (config.description) input += `\t ${config.description}`;
            if (config.default) input += ` [${config.default}]`; 
            console.log(input);
        }
        console.log(`\t ${this._applicationName} \t-h | --help \t This text`);
        console.log('\n');
    }

    showHelp() {
        this._createHelpText();
        process.exit(this._exitCode);
    }

    get inputs() { return this._inputs; }
    get flags() { return this._flags; }
    get help() { return this.showHelp(); }
}