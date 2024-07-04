import { Parser } from './Parser.js';
import { STXTProcessor } from './STXTProcessor.js';
import { NamespaceRetriever } from './NamespaceRetriever.js';

export class STXTParser extends Parser {
    constructor(namespaceRetriever) {
        super();
        this.addNodeProcessor(new STXTProcessor(namespaceRetriever));
    }
}

