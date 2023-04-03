

export default class CliHelp {

    constructor() {

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
}