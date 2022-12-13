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
        this._possibleTypes = [
            "string",
            "boolean",
            "number"
        ];

        this._addHelpFlag();
        this._validateFlags();
        if (this.options.detectVersion) this._loadPackageJson();
    }

    /**
     * The flags can be configured as following: 
     * {
     *      help: {
     *          type: 'boolean',
     *          alias: 'h',
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
            flagValue.keys().forEach(k => k.toLowerCase());
            if (!flagValue.keys().includes("type")) throw new Error(`The flag must belong to a type. Possible types are '${this._possibleTypes.join(",")}'`);
            if (!this._possibleTypes.includes(flagValue.type)) throw new Error(`Flag contain a type which are not supported by the tool. `);
        }
    }

    _validateFlags() {
        let nextArgvBelongsToCurrent = false;
        let readInputs = true;
        for (const arg of this._argv) {
            const result = /^-{1,2}([\w=]+)/.exec(arg);
            if (result[1]) {
                // We got a flag or alias
                readInputs = false;
                const checkForFlagResult = result[1].split('=');
                const flagKey = checkForFlagResult[0].toLowerCase();
                const flagValue = checkForFlagResult[1];
                const config  = this._configFlags[flagKey];
                if (flagValue) {
                    // flag has a '=' sign
                    if (config) {
                        switch(config.type.toLowerCase()) {
                            case "boolean":
                                this._flags[flagKey]
                                break;
                            case "number":

                                break;
                            case "string":

                                break;
                            default:
                                throw new Error("Got a flag type that is not supported by the tool");
                        }
                    } 
                    if (this._options.detectUnknownFlags) {
                        this._flags[checkForFlagResult[0]] = checkForFlagResult[1];
                    }
                } else {
                    // flag is missing '=' sign
                    
                }
                break;
            }
            // read inputs
            if (readInputs) this._inputs.push(arg);
        }
    }

    _validateAlias(argv) {
        return (argv.startWith("--")) ? false : true;
    }

    _validateBoolean() {

    }

    _validateString() {

    }

    _validateNumber() {

    }

    _parseArgv() {
        const argv = argvParser(this._argv);
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
    get help() { return this._help; }
}