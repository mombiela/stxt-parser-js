import { getUrlContent } from './utilsURL.js';
import { Constants } from './constants.js';
import { RootGrammar } from './RootGrammar.js';

export class GrammarRetrieve {
    static CACHE = new Map();

    constructor() {
        // Insert the root namespace into the cache
        try {
            console.log("INSERTING ROOT NAMESPACE in CACHE");
            GrammarRetrieve.CACHE.set(Constants.ROOT_NAMESPACE, RootGrammar.getRootGrammarContentString());
        } catch (e) {
            console.error(e);
        }
    }

    addGrammarDefinition(nameSpace, content) {
        GrammarRetrieve.CACHE.set(nameSpace, content);
    }

    static async getNameSpaceContent(namespace) {
        if (GrammarRetrieve.CACHE.has(namespace)) {
            return GrammarRetrieve.CACHE.get(namespace);
        }

        // Search on the internet
        const uri = `https://${namespace}`;
        const fileContent = await getUrlContent(uri);

        GrammarRetrieve.CACHE.set(namespace, fileContent);

        return GrammarRetrieve.CACHE.get(namespace);
    }
}
