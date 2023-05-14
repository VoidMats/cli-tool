import { CliHelpException } from "./CliExceptions.js";


export default class CliHelp {

    constructor(obj) {
        this.__obj = obj;
    }

    createHelpText(obj) {
        if (!this.__obj && !obj) throw new CliHelpException(1, "Missing help object");
        if (obj) this.__obj = obj;
        let helpString = "";
        if (this.__obj._application.name) helpString += `\n ${this.__obj._application.name.toUpperCase()}\n`;
        if (this.__obj._application.version) helpString += ` Version: ${this.__obj._application.version}\n`;
        if (!this.__obj._options.disableColors) {
            helpString += " \x1b[45m Usage: \x1b[0m\n"; // Magneta
            helpString += `${this.__obj._description}\n`;
            helpString += `\t$\x1b[35m node ${this.__obj._application.name} \x1b[36m<commands>\x1b[90m [options] \x1b[0m \n`;
            helpString += "\n \x1b[46m Commands: \x1b[0m"; // Cyan
            helpString += this._createTextInputs();
            helpString += "\n \x1b[100m Options: \x1b[0m"; // Grey
            //this._createTextOptions();
        } else {
            helpString += "Usage: ";
            helpString += `${this.__obj._description}\n`;
            helpString += `  $ node ${this.__obj._application.name} <commands> [options] \n`;
            helpString += ` Commands: `;
            helpString += this._createTextInputs();
            helpString += `\n Options: `;
            //this._createTextOptions();
        }
        console.log(helpString)
        return helpString;
    }

    _createTextOptions() {
        for (const [key, config] of Object.entries(this.__obj._configFlags)) {
            let option = `\t --${key}\t${(config.alias) ? `-${config.alias}` : ""}\t`;
            if (config.description) option += config.description;
            if (config.default) option += ` [${config.default}]`;
            console.log(option);
        }
        console.log(`\t --help \t-h \tThis text`);
        console.log('\n');
    }

    _createTextInputs() {
        let inputText = "";
        for (let i = 0; i < this.__obj._configInputs.length; i++) {
            const config = this.__obj._configInputs[i];
            let input = `  <${(config.name ? config.name : "input_" + i+1)}>`;
            if (config.description) input += `  ${config.description}`;
            if (config.default) input += ` [${config.default}]`;
            input += '\n'; 
            inputText += input;
        }
        inputText += '\n';
        return inputText;
    }
}