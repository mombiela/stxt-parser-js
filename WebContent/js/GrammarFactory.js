import { GrammarRetrieve } from './GrammarRetrieve.js';
import { NodeToGrammar } from './NodeToGrammar.js';
import { ParseException } from './ParseException.js';
import { Node } from './Node.js';

export class GrammarFactory {
    constructor() {
        this.grammarRetrieve = new GrammarRetrieve();
    }

    async createGrammar(namespace) {
        const content = await this.grammarRetrieve.getNameSpaceContent(namespace);
        const node = this.parseContentToNode(content, namespace);
        return NodeToGrammar.translate(node, namespace);
    }

    parseContentToNode(content, namespace) {
        const lines = content.split('\n');
        const rootNode = new Node();
        rootNode.setCanonicalName('ns_def');
        rootNode.setNamespace(namespace);

        let currentNode = rootNode;
        let currentLevel = 0;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
                return;
            }

            const level = line.search(/\S/);
            if (level > currentLevel) {
                currentNode = currentNode.getChilds().slice(-1)[0];
            } else if (level < currentLevel) {
                currentNode = rootNode;
            }
            currentLevel = level;

            const parts = trimmedLine.split(':');
            const node = new Node();
            node.setCanonicalName(parts[0].trim());
            node.setValue(parts[1]?.trim() || '');

            currentNode.getChilds().push(node);
        });

        return rootNode;
    }
}
