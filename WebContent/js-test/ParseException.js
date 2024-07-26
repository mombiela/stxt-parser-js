import { ParseException } from '../js/stxt-parser.js';

export async function testParseException() {
    let result = "";
    try {
        throw new ParseException("An error occurred", 42);
    } catch (e) {
        result += e.message + "<br>"; // Line 42: An error occurred
        result += e.line + "<br>";    // 42
        result += e.name + "<br>";    // ParseException
    }
    return result;
}
