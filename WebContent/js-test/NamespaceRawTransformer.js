import { NamespaceRawTransformer } from '../js/NamespaceRawTransformer.js';
import { Node } from '../js/Node.js';

export async function testNamespaceRawTransformer() {
    let result = "";

    const node = new Node(1, 0, "Namespace", "ExampleNamespace");

    const childNode1 = new Node(2, 1, "child1", "STRING");
    node.addChild(childNode1);

    const childNode2 = new Node(3, 1, "child2", "INTEGER");
    node.addChild(childNode2);

    try {
        const namespace = await NamespaceRawTransformer.transformRawNode(node);
        result += `Transformed Namespace: ${namespace.toString().replace(/\n/g, "<br>")}<br>`;
    } catch (e) {
        result += `Error: ${e.message}<br>`;
    }

    return result;
}
