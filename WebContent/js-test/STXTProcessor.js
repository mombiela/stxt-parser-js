import { STXTProcessor } from '../js/stxt-parser.js';
import { NamespaceRetriever } from '../js/stxt-parser.js';
import { Node } from '../js/stxt-parser.js';

export async function testSTXTProcessor() {
    let result = "";

    const namespaceRetriever = new NamespaceRetriever();
    const processor = new STXTProcessor(namespaceRetriever);

    const node = new Node(1, 0, "Namespace", "ExampleNamespace");

    const childNode1 = new Node(2, 1, "child1", "STRING");
    node.addChild(childNode1);

    const childNode2 = new Node(3, 1, "child2", "INTEGER");
    node.addChild(childNode2);

    try {
        await processor.processNodeOnCreation(node);
        result += `Processed Node on Creation Successfully<br>`;
    } catch (error) {
        result += `Error processing Node on Creation: ${error.message}<br>`;
    }

    try {
        await processor.processNodeOnCompletion(node);
        result += `Processed Node on Completion Successfully<br>`;
    } catch (error) {
        result += `Error processing Node on Completion: ${error.message}<br>`;
    }

    return result;
}
