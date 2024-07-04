import { isValidType, isMultiline, isValuesType, isValidNamespace, isValidCount, getDefault} from '../js/NamespaceType.js';

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
