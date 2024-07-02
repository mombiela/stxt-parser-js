export class ParseException extends Error {
    constructor(message, line) {
        super(`Line ${line}: ${message}`);
        this.line = line;
        this.name = "ParseException";
    }
}
