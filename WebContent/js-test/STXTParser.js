import { STXTParser } from '../js/stxt-parser.js';
import { NamespaceRetriever } from '../js/stxt-parser.js';

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
