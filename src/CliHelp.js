

export default class CliHelp {

    constructor(obj) {
        this.__obj = obj;
    }

    static createHelpText() {
        let helpString = "";
        if (this.__obj._application.name) helpString += `\n ${this.__.obj._application.name.toUpperCase()}`;
        if (this.__.obj._application.version) helpString += ` Version: ${this.__.obj._application.version}\n`;
        if (!this.__.obj._options.disableColors) {
            helpString += "\x1b[45m Usage: \x1b[0m", '\n'; // Magneta
            helpString += this.__.obj._description, '\n';
            helpString += `\t $\x1b[35m node ${this.__.obj._application.name} \x1b[36m<commands>\x1b[90m [options] \x1b[0m \n`;
            helpString += "\n\x1b[46m Commands: \x1b[0m"; // Cyan
            //helpString += this._createTextInputs();
            helpString += "\n\x1b[100m Options: \x1b[0m"; // Grey
            //this._createTextOptions();
        } else {
            console.log("Usage: ");
            console.log(this.__.obj._description, '\n');
            console.log(`\t $ node ${this.__.obj._application.name} <commands> [options] \n`);
            console.log("Commands/Inputs: ");
            this._createTextInputs();
            console.log("Options: ");
            this._createTextOptions();
        }
        return helpString;
    }

    _createTextOptions() {
        for (const [key, config] of Object.entries(this.__.obj._configFlags)) {
            let option = `\t --${key}\t${(config.alias) ? `-${config.alias}` : ""}\t`;
            if (config.description) option += config.description;
            if (config.default) option += ` [${config.default}]`;
            console.log(option);
        }
        console.log(`\t --help \t-h \tThis text`);
        console.log('\n');
    }

    _createTextInputs() {
        for (let i = 0; i < this.__.obj._configInputs.length; i++) {
            const config = this.__.obj._configInputs[i];
            let input = `\t$ ${this.__.obj._application.name} <${(config.name ? config.name : "input_" + i+1)}>`;
            if (config.description) input += `\t ${config.description}`;
            if (config.default) input += ` [${config.default}]`; 
            console.log(input);
        }
        console.log('\n');
    }
}