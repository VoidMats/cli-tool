import process from "node:process";
import * as url from "url";

const __dirname = url.fileURLToPath(import.meta.url);

/**
 * TODO 
 * - Validate options
 * - Write help text
 * - Remove all exceptions. Replace with process.exit(this._exitCode) 
 * - Check for required flags
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
    constructor(options = {}) {
        this._options = {
            disableColors: (process.env.NODE_DISABLE_COLORS) ? process.env.NODE_DISABLE_COLORS : false,
            detectVersion: false,
            booleanDefault: false,
            detectUnknownFlags: false,
            exitCode: 0,
            ...options
        }
        this._argv = process.argv.slice(2);
        this._configFlags = {};
        this._inputs = [];
        this._flags = {};
        this._nextArgvBelongsToCurrent = undefined;
        this._possibleTypes = [
            "string",
            "boolean",
            "number"
        ];

        if (this._options.detectVersion) this._loadPackageJson();
    }

    /**
     * The flags can be configured as following: 
     * {
     *      help: {
     *          type: 'boolean',
     *          alias: 'h' or '-h',
     *          default: 'This is default text',
     *          example: 'Text shown in example',
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
        this._validateFlags();
        this._validateForRequiredFlags();
    }

    _validateFlags() {
        let readInputs = true;
        for (let i=0; i < this._argv.length; i++) {
            const arg = this._argv[i];
            const argNext = (i+1 < this._argv.length) ? this._argv[i+1] : undefined; 
            this._validateForHelp(arg);
            if (!this._validateInput(arg)) {
                readInputs = false;
                if (this._validateAlias(arg)) {
                    let result = this._validateEqualSign(arg);
                    result[0] = this._findFlagFromAlias(result[0]);
                    this._enterResult(result);
                } else {
                    let result = this._validateEqualSign(arg);
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
    }

    _validateForRequiredFlags() {
        for (const [flag, conf] of Object.entries(this._configFlags)) {
            if (conf.required && !this._flags[flag]) {
                console.log(`Flag '${flag}' is missing in cli command. Please refer to --help or -h. \n`);
                this.showHelp();
            } 
        }
    }

    _validateForHelp(arg) {
        if (arg === "-h" || arg === "--help") {
            this.showHelp();
        }
    }

    _validateInput(arg) {
        const result = /^-{1,2}/.exec(arg);
        return (result) ? false : true; 
    }

    _validateAlias(arg) {
        return (arg.startsWith("--")) ? false : true;
    }

    _validateEqualSign(arg) {
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
            console.log('\x1b[36m%s\x1b[0m', "I am cyan");
            console.log('\x1b[35m%s\x1b[0m', "FgMagneta");
        } else {
            console.log("some text")
        }
    }

    _createExample() {

    }

    showHelp() {
        const helpText = this._createHelpText();
        console.log(helpText);
        process.exit(this._exitCode);
    }

    get inputs() { return this._inputs; }
    get flags() { return this._flags; }
    get help() { return this.showHelp(); }
}