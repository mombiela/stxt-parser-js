import { LineIndent } from '../js/LineIndent.js';

export async function testLineIndent() {
    let result = "";
    try {
        const line = "    \tTest line with indent";
        const parsedLine = LineIndent.parseLine(line, false, 0, 1);
        if (parsedLine) {
            result += `Indent Level: ${parsedLine.indentLevel}<br>`;
            result += `Line Without Indent: ${parsedLine.lineWithoutIndent}<br>`;
        } else {
            result += "Line is a comment or empty<br>";
        }
    } catch (e) {
        result += `Error: ${e.message}<br>`;
    }

    const lineWithBOM = "\uFEFFSome text with BOM";
    const cleanedLine = LineIndent.removeUTF8BOM(lineWithBOM);
    result += `Line without BOM: ${cleanedLine}<br>`;

    return result;
}
