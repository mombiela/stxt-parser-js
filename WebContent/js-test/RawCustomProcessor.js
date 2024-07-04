import { RawCustomProcessor } from '../js/RawCustomProcessor.js';
import { Node } from '../js/Node.js';

export async function testRawCustomProcessor() {
    let result = "";

    const processor = new RawCustomProcessor();
    processor.setMultilineNodes(new Set(['multilineNode']));
    processor.setAllowedNames(new Set(['root', 'child', 'multilineNode']));

    const validNode = new Node(1, 0, 'root', 'Root Node');
    const invalidNode = new Node(2, 1, 'invalid', 'Invalid Node');

    try {
        await processor.processNodeOnCreation(validNode);
        result += `Valid node processed: ${validNode.getName()}<br>`;
    } catch (e) {
        result += `Error processing valid node: ${e.message}<br>`;
    }

    try {
        await processor.processNodeOnCreation(invalidNode);
        result += `Invalid node processed: ${invalidNode.getName()}<br>`;
    } catch (e) {
        result += `Error processing invalid node: ${e.message}<br>`;
    }

    return result;
}
