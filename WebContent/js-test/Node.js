import { Node } from '../js/stxt-parser.js';
import { NodeLine } from '../js/stxt-parser.js';

export async function testNode() {
    let result = "";

    const node = new Node(1, 2, "testNode", "nodeValue");
    node.setMultiline(true);
    node.setMetadata("key", "value");
    node.addLine(new NodeLine(1, 2, "lineValue", true));
    node.addChild(new Node(2, 3, "childNode", "childValue"));

    result += `Node Name: ${node.getName()}<br>`;
    result += `Node Value: ${node.getValue()}<br>`;
    result += `Node Line Creation: ${node.getLineCreation()}<br>`;
    result += `Node Level Creation: ${node.getLevelCreation()}<br>`;
    result += `Node is Multiline: ${node.isMultiline()}<br>`;
    result += `Node Metadata (key): ${node.getMetadata("key")}<br>`;
    result += `Node Text: ${node.getText()}<br>`;
    result += `Node ToString: ${node.toString()}<br>`;

    return result;
}
