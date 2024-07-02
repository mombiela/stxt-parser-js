import { Namespace } from './Namespace.js';
import { Parser } from './Parser.js';
import { NamespaceRawTransformer } from './NamespaceRawTransformer.js';
import { getUrlContent } from './Utils.js';

export class NamespaceRetriever {
    constructor(allowInternet = false) {
        this.CACHE = new Map();
        this.allowInternet = allowInternet;
    }

    addGrammarDefinition(content, expected = null) {
        return new Promise(async (resolve, reject) => {
            try {
                // Parse raw Content
                const parser = new Parser();
                const namespacesNodes = await parser.parse(content);

                // Get result
                const namespaces = [];
                for (const n of namespacesNodes) {
                    namespaces.push(await NamespaceRawTransformer.transformRawNode(n));
                }

                if (expected !== null && (namespaces.length !== 1 || namespaces[0].getName() !== expected)) {
                    reject(new ParseException(`Namespace is ${namespaces[0].getName()}, expected: ${expected}`, 0));
                }

                // Add result
                for (const ns of namespaces) {
                    const name = ns.getName();
                    if (this.CACHE.has(name)) {
                        reject(new ParseException(`Namespace already exist: ${name}`, 0));
                    }
                    this.CACHE.set(name, ns);
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    getAllNamespaces() {
        return new Set(this.CACHE.keys());
    }

    async getNameSpace(namespace) {
        if (this.CACHE.has(namespace)) {
            return this.CACHE.get(namespace);
        }

        // Search on the internet
        if (this.allowInternet) {
            try {
                const uri = new URL(`https://${namespace}`);
                const fileContent = await getUrlContent(uri);
                await this.addGrammarDefinition(fileContent, namespace);
                return this.CACHE.get(namespace);
            } catch (error) {
                throw new Error(`Error retrieving namespace: ${error.message}`);
            }
        }

        return this.CACHE.get(namespace);
    }
}

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
