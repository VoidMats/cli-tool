import process from "node:process";
import * as url from "url";

const __dirname = url.fileURLToPath(import.meta.url);

export default class CliTool {

    constructor(options = {}) {
        this._options = {
            disableColors: (process.env.NODE_DISABLE_COLORS) ? process.env.NODE_DISABLE_COLORS : false,
            detectVersion: false,
            booleanDefault: false,
            detectUnknownFlags: false,
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

        this._validateFlags();
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
        for (let [flagKey, flagValue] of Object.entries(config)) {
            flagKey = flagKey.toLowerCase();
            Object.keys(flagValue).forEach(k => k.toLowerCase());
            if (flagValue.alias) {
                if (alias.startWith('-')) alias.slice(1);
                flagValue.alias = flagValue.alias.toLowerCase();
            }
            if (!Object.keys(flagValue).includes("type")) throw new Error(`The flag must belong to a type. Possible types are '${this._possibleTypes.join(",")}'`);
            if (!this._possibleTypes.includes(flagValue.type)) throw new Error(`Flag contain a type which are not supported by the tool. `);
        }
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
                    const result = this._validateEqualSign(arg);
                    this._enterResult(result, this._findConfigFromFlag(result[0]));
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
        if (arg === "-h" || arg === "--help") this._showHelp();
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
        if (alias.startWith('-')) alias.slice(1);
        for (let [flagKey, flagValue] of Object.entries(config)) {
            if (flagValue.alias === alias) return flagKey;
        }
        throw new Error(`Unknow alias '-${alias}'. Please refer to help (-h or --help) for more info `)
    }

    _enterResult(result, hasConfig = true) {
        if (this._options.detectUnknownFlags || hasConfig) {
            if (result.length === 1) {
                this._nextArgvBelongsToCurrent = result[0];
            } else {
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
        if (this._applicationVersion) {
            console.error(`Can't detect version from package.json`);
        }
    }

    _addHelpFlag() {
        this._configFlags["help"] = {
            type: 'boolean',
            alias: 'h',
            default: this._createHelpText(),
            required: false
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