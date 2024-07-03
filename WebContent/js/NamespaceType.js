export const NamespaceType = {
    TEXT: "TEXT",
    STRING: "STRING",
    NUMBER: "NUMBER",
    BOOLEAN: "BOOLEAN",
    REGEX: "REGEX",
    ENUM: "ENUM",
    DATE: "DATE",
    TIMESTAMP: "TIMESTAMP",
    EMAIL: "EMAIL",
    URL: "URL",
    HEXADECIMAL: "HEXADECIMAL",
    BASE64: "BASE64",
    EMPTY: "EMPTY",
    INTEGER: "INTEGER",
    NATURAL: "NATURAL",
	"getDefault": getDefault,
	"isValidType": isValidType,
	"isMultiline": isMultiline,
	"isValuesType": isValuesType,
	"isValidNamespace": isValidNamespace,
	"isValidCount": isValidCount
};

const MULTILINE_TYPES = new Set([NamespaceType.TEXT, NamespaceType.BASE64, NamespaceType.HEXADECIMAL]);
const SINGLELINE_TYPES = new Set([
    NamespaceType.STRING, NamespaceType.NUMBER, NamespaceType.BOOLEAN, NamespaceType.REGEX, NamespaceType.ENUM,
    NamespaceType.DATE, NamespaceType.TIMESTAMP, NamespaceType.EMAIL, NamespaceType.URL, NamespaceType.EMPTY,
    NamespaceType.INTEGER, NamespaceType.NATURAL
]);
const ALL_TYPES = new Set([...SINGLELINE_TYPES, ...MULTILINE_TYPES]);
const VALUES_TYPES = new Set([NamespaceType.ENUM, NamespaceType.REGEX]);
const ALLOWED_COUNT = new Set(["*", "+", "?"]);

const COUNT = /^\d+(\+|-)?$/;

export function getDefault() {
    return NamespaceType.STRING;
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
    result += `Is valid namespace (example.stxt): ${isValidNamespace("example.stxt")}<br>`;
    result += `Is valid namespace (example.txt): ${isValidNamespace("example.txt")}<br>`;
    result += `Is valid count (*): ${isValidCount("*")}<br>`;
    result += `Is valid count (5+): ${isValidCount("5+")}<br>`;
    result += `Is valid count (abc): ${isValidCount("abc")}<br>`;

    return result;
}
