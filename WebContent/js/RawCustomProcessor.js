import { Processor } from './Processor.js';
import { Node } from './Node.js';
import { ParseException } from './ParseException.js';

export class RawCustomProcessor extends Processor {
    constructor() {
        super();
        this.multilineNodes = new Set();
        this.allowedNames = new Set();
    }

    setMultilineNodes(multilineNodes) {
        this.multilineNodes = multilineNodes;
    }

    setAllowedNames(allowedNames) {
        this.allowedNames = allowedNames;
    }

    async processNodeOnCreation(node) {
        if (this.multilineNodes && this.multilineNodes.has(node.getName())) {
            node.setMultiline(true);
        }

        if (this.allowedNames && !this.allowedNames.has(node.getName())) {
            throw new ParseException("Node name not allowed: " + node.getName(), node.getLineCreation());
        }
    }

    async processNodeOnCompletion(node) {
        // No operation
    }

    async processBeforeAdd(parent, child) {
        // No operation
    }

    async processAfterAdd(parent, child) {
        // No operation
    }
}

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
