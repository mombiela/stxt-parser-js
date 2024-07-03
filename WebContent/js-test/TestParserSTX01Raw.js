import { NamespaceRetriever } from '../js/NamespaceRetriever.js';
import { STXTParser } from '../js/STXTParser.js';
import { Node } from '../js/Node.js';
import { ParseException } from '../js/ParseException.js';
import { getUrlContent } from '../js/Utils.js';

export async function TestParserSTX01Raw()
{
	// Buscamos contents
	let g_client = await getUrlContent("/namespaces/client.stxt");
	let g_doc_simple = await getUrlContent("/namespaces/doc_simple.stxt");
	
	// Creamos parser
    const namespaceRetriever = new NamespaceRetriever();
	

	
	return g_client + "\n" + g_doc_simple;
}