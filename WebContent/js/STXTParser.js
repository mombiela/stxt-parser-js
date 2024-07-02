import { Parser } from './Parser.js';
import { STXTProcessor } from './STXTProcessor.js';
import { NamespaceRetriever } from './NamespaceRetriever.js';

export class STXTParser extends Parser {
    constructor(namespaceRetriever) {
        super();
        this.addNodeProcessor(new STXTProcessor(namespaceRetriever));
    }
}

export async function testSTXTParser() {
    let result = "";

    const namespaceRetriever = new NamespaceRetriever();
    const parser = new STXTParser(namespaceRetriever);

    const content = `
Namespace: ExampleNamespace
    child1: STRING
    child2: INTEGER
`;

    try {
        const nodes = await parser.parse(content);
        result += `Parsed Nodes Successfully: ${JSON.stringify(nodes)}<br>`;
    } catch (error) {
        result += `Error parsing content: ${error.message}<br>`;
    }

    return result;
}
