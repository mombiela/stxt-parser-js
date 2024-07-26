import { LineSplitter } from '../js/stxt-parser.js';

export async function testLineSplitter() {
    let result = "";
    const input = "(prefix) central text (suffix)";
    const lineSplitter = LineSplitter.split(input);
    
    result += `Prefix: ${lineSplitter.getPrefix()}<br>`;
    result += `Central Text: ${lineSplitter.getCentralText()}<br>`;
    result += `Suffix: ${lineSplitter.getSuffix()}<br>`;
    
    const noParenthesesInput = "just central text";
    const lineSplitterNoParentheses = LineSplitter.split(noParenthesesInput);
    
    result += `Prefix: ${lineSplitterNoParentheses.getPrefix()}<br>`;
    result += `Central Text: ${lineSplitterNoParentheses.getCentralText()}<br>`;
    result += `Suffix: ${lineSplitterNoParentheses.getSuffix()}<br>`;
    
    return result;
}
