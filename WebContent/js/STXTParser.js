import { Parser } from './Parser.js';
import { STXTProcessor } from './STXTProcessor.js';

export class STXTParser extends Parser {
    constructor(namespaceRetriever) {
        super();
        this.addNodeProcessor(new STXTProcessor(namespaceRetriever));
    }
}

