const TEXT = "TEXT";
const STRING = "STRING";
const NUMBER = "NUMBER";
const BOOLEAN = "BOOLEAN";
const REGEX = "REGEX";
const ENUM = "ENUM";
const DATE = "DATE";
const TIMESTAMP = "TIMESTAMP";
const EMAIL = "EMAIL";
const URL_TYPE = "URL";
const HEXADECIMAL = "HEXADECIMAL";
const BASE64 = "BASE64";
const EMPTY = "EMPTY";
const INTEGER = "INTEGER";
const NATURAL = "NATURAL";

const MULTILINE_TYPES = new Set([TEXT, BASE64, HEXADECIMAL]);
const SINGLELINE_TYPES = new Set([
    STRING, NUMBER, BOOLEAN, REGEX, ENUM, DATE, TIMESTAMP, EMAIL, URL_TYPE, EMPTY, INTEGER, NATURAL
]);
const ALL_TYPES = new Set([...SINGLELINE_TYPES, ...MULTILINE_TYPES]);
const VALUES_TYPES = new Set([ENUM, REGEX]);
const ALLOWED_COUNT = new Set(["*", "+", "?"]);

const COUNT = /^\d+(\+|-)?$/;

export function getDefault() {
    return STRING;
}

export function isValidType(type) {
    return ALL_TYPES.has(type);
}

export function isMultiline(type) {
    return MULTILINE_TYPES.has(type);
}

export function isValuesType(type) {
    return VALUES_TYPES.has(type);
}

export function isValidNamespace(namespace) {
    try {
        if (!namespace.endsWith(".stxt")) return false;
        new URL("https://" + namespace);
        return true;
    } catch (e) {
        return false;
    }
}

export function isValidCount(num) {
    return ALLOWED_COUNT.has(num) || validateValue(COUNT, num);
}

function validateValue(pattern, value) {
    return pattern.test(value);
}

export async function testNamespaceType() {
    let result = "";

    result += `Default: ${getDefault()}<br>`;
    result += `Is valid type (STRING): ${isValidType("STRING")}<br>`;
    result += `Is valid type (INVALID): ${isValidType("INVALID")}<br>`;
    result += `Is multiline (TEXT): ${isMultiline("TEXT")}<br>`;
    result += `Is multiline (STRING): ${isMultiline("STRING")}<br>`;
    result += `Is values type (ENUM): ${isValuesType("ENUM")}<br>`;
    result += `Is values type (STRING): ${isValuesType("STRING")}<br>`;
    result += `Is valid namespace (example.com/example.stxt): ${isValidNamespace("example.com/example.stxt")}<br>`;
    result += `Is valid namespace (example.txt): ${isValidNamespace("example.txt")}<br>`;
    result += `Is valid count (*): ${isValidCount("*")}<br>`;
    result += `Is valid count (5+): ${isValidCount("5+")}<br>`;
    result += `Is valid count (abc): ${isValidCount("abc")}<br>`;

    return result;
}
