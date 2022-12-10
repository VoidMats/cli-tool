import process from "node:process";
import argvParser from "yargs-parser";

export default class CliTool {

    constructor(options = {}) {
        this._argv = process.argv.slice(2);
        this._input = [];
        this._flags = {};
        this._help = "";
    }

    addInputs() {
        
    }

    addFlags() {

    }

    _validateOptions() {

    }

    _parseArgv() {
        const argv = argvParser(this._argv);
    }

    _createHelpText() {

    }

    _showExample() {

    }

    showHelp() {

    }

    showVersion() {

    }

    get input() { return this._input; }
    get flags() { return this._flags; }
    get help() { return this._help; }
}