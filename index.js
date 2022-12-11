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
        }
    }

    _validateFlags() {
        let nextArgvBelongsToCurrent = false;
        let readInputs = true;
        for (const arg of this._argv) {
            const result = /^-{1,2}([\w=]+)/.exec(arg);
            if (result[1]) {
                readInputs = false;
                const checkForFlagResult = result[1].split('=');
                if (checkForFlagResult[1]) {
                    // Check config 
                    for (const [configKey, configValue] of Object.entries(this._configFlags)) {
                        
                    }
                    this._flags[checkForFlagResult[0]] = checkForFlagResult[1];
                } else {

                }
            } else {
                if (readInputs) this._inputs.push(arg);
                else break;
            }
        }
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