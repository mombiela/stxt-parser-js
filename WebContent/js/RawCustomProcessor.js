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

