import process from "node:process";
import * as url from "url";

const __dirname = url.fileURLToPath(import.meta.url);

/**
 * TODO 
 * - Validate options
 * - Write help text
 * - Check for -h or --help in config flags 
 * - Remove all exceptions. Replace with process.exit(this._exitCode) 
 * - Write test for mixed input and flags
 * - Write test for detectUnknownFlags
 * - Write test for booleanDefault
 * - Write test for detectVersion
 **/

export default class CliTool {

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
    }

    _validateFlags() {
        let readInputs = true;
        for (const arg of this._argv) {
            this._validateForHelp(arg);
            if (!this._validateInput(arg)) {
                readInputs = false;
                if (this._validateAlias(arg)) {
                    // Alias
                    let result = this._validateEqualSign(arg);
                    result[0] = this._findFlagFromAlias(result[0]);
                    this._enterResult(result);
                } else {
                    // Flag
                    let result = this._validateEqualSign(arg);
                    if (result[0].startsWith('--')) result[0] = result[0].slice(2);
                    const hasConfig = this._findConfigFromFlag(result[0])
                    console.log(`${result.join(" - ")} = ${hasConfig}`)
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

    _validateForHelp(arg) {
        if (arg === "-h" || arg === "--help") {
            this._showHelp();
            process.exit(this._exitCode);
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
        const checkForFlagResult = arg.split('=');
        if (checkForFlagResult.length === 1) {
            return [checkForFlagResult[0]];
        } else {
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
            switch(this._configFlags[result[0]]?.type) {
                case "string":
                    this._flags[result[0]] = result[1];
                    break;
                case "boolean":
                    this._flags[result[0]] = JSON.parse((result[1]));
                    break;
                case "number":
                    this._flags[result[0]] = Number(result[1]);
                    break;
                default:
                    // Beacuse config is missing or config type is wrong value will be passed as string
                    this._flags[result[0]] = result[1];
            }
        }
    }

    _checkForRequiredFlags() {

    }

    _validateType() {

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

    }

    _showExample() {

    }

    showHelp() {

    }

    get inputs() { return this._inputs; }
    get flags() { return this._flags; }
    get help() { return this.showHelp(); }
}