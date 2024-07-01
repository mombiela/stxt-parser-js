import { GrammarRetrieve } from './GrammarRetrieve.js';
import { ParseException } from './ParseException.js';
import { Node } from './Node.js';

export class Parser {
    constructor() {
        this.grammarRetrieve = new GrammarRetrieve();
    }

    async parse(input) {
        const namespace = 'www.semantictext.info/namespace.stxt';
        const content = await this.grammarRetrieve.getNameSpaceContent(namespace);
        const grammar = this.parseGrammar(content);

        // Implement the actual parsing logic based on the grammar
        const rootNode = new Node();
        rootNode.setCanonicalName('root');
        rootNode.setNamespace(namespace);

        // Assuming input is a simple representation of nodes
        input.split('\n').forEach(line => {
            const node = new Node();
            const [canonicalName, value] = line.split(':');
            node.setCanonicalName(canonicalName.trim());
            node.setValue(value.trim());
            rootNode.getChilds().push(node);
        });

        return rootNode;
    }

    parseGrammar(content) {
        const lines = content.split('\n');
        const grammar = [];

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
                return;
            }

            const parts = trimmedLine.split(':');
            const node = new Node();
            node.setCanonicalName(parts[0].trim());
            node.setValue(parts[1]?.trim() || '');

            grammar.push(node);
        });

        return grammar;
    }
}
