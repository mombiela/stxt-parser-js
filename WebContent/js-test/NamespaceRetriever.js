import { NamespaceRetriever } from '../js/stxt-parser.js';

export async function testNamespaceRetriever() {
    let result = "";

    const retriever = new NamespaceRetriever();
    const content = `
Namespace: TestNamespace
    child1: STRING
    child2: INTEGER
`;

    try {
        await retriever.addGrammarDefinition(content);
        result += `Added Grammar Definition Successfully<br>`;
    } catch (error) {
        result += `Error adding Grammar Definition: ${error.message}<br>`;
    }

    const allNamespaces = retriever.getAllNamespaces();
    result += `All Namespaces: ${Array.from(allNamespaces).join(", ")}<br>`;

    try {
        const namespace = await retriever.getNameSpace("TestNamespace");
        result += `Retrieved Namespace: ${namespace.toString().replace(/\n/g, "<br>")}<br>`;
    } catch (error) {
        result += `Error retrieving Namespace: ${error.message}<br>`;
    }

    return result;
}
