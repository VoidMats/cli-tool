

/**
 * Some explaning text
 * @class
 */
class CliException extends Error {

    /**
     * @param { Number } code 
     * @param { String } message 
     */
    constructor(code, message, ...params) {
        super(...params);
        this.timestamp = new Date().toLocaleString();
        this.code = code;
        this.message = message;
        const frame = this.stack.split("\n")[1];
        const functionName = frame.split(" ")[5];
        this.log = `${this.timestamp} - ${functionName} - ${this.message}`;
    }
}

/**
 * Some explaning text
 * @class
 */
class CliHelpException extends CliException {

    /**
     * @constructor
     * @param { Number } code
     * @param { String } message
     * @param { Object } help
     */
    constructor(code, message, help, ...params) {
        super(code, message, ...params);
        Error.captureStackTrace(this, this.constructor);
        this.help = help;
        console.log(this.help);
    }
}

export {
    CliException,
    CliHelpException
}