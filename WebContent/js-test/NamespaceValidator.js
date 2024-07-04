import { NamespaceValidator } from '../js/NamespaceValidator.js';
import { NamespaceNode } from '../js/NamespaceNode.js';
import { Node } from '../js/Node.js';

export async function testNamespaceValidator() {
    let result = "";

    const nsNode = new NamespaceNode();
    nsNode.setType("STRING");

    const node = new Node(1, 0, "testNode", "testValue");

    try {
        await NamespaceValidator.validateValue(nsNode, node);
        result += `Valid STRING value<br>`;
    } catch (e) {
        result += `Error validating STRING value: ${e.message}<br>`;
    }

/*    nsNode.setType("EMAIL");
    node.setValue("invalid-email");

    try {
        await NamespaceValidator.validateValue(nsNode, node);
        result += `Valid EMAIL value<br>`;
    } catch (e) {
        result += `Error validating EMAIL value: ${e.message}<br>`;
    }
*/
    return result;
}
