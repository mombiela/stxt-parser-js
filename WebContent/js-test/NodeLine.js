import { NodeLine } from '../js/stxt-parser.js';

export async function testNodeLine() {
    let result = "";

    const nodeLine = new NodeLine(1, 2, "test value", true);
    result += `Value: ${nodeLine.getValue()}<br>`;
    result += `Line Creation: ${nodeLine.getLineCreation()}<br>`;
    result += `Level Creation: ${nodeLine.getLevelCreation()}<br>`;
    result += `Is Explicit: ${nodeLine.isExplicit()}<br>`;
    result += `Is Implicit: ${nodeLine.isImplicit()}<br>`;
    result += `ToString: ${nodeLine.toString()}<br>`;

    return result;
}
