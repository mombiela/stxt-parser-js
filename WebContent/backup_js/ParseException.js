export class ParseException extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'ParseException';
        if (cause) {
            this.cause = cause;
        }
    }
}
