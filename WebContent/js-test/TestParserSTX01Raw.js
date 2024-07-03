import { NamespaceRetriever } from '../js/NamespaceRetriever.js';
import { STXTParser } from '../js/STXTParser.js';
import { Parser } from '../js/Parser.js';
import { Node } from '../js/Node.js';
import { ParseException } from '../js/ParseException.js';
import { getUrlContent } from '../js/Utils.js';

export async function TestParserSTX01Raw()
{
	// Buscamos contents
	let g_client = await getUrlContent("/namespaces/client.stxt");
	let g_doc_simple = await getUrlContent("/namespaces/doc_simple.stxt");
	
	let parser = new Parser();
	let doc = (await parser.parse(g_client))[0];
	
	// Creamos parser
	/*
    const namespaceRetriever = new NamespaceRetriever();
	await namespaceRetriever.addGrammarDefinition(g_client);
	
	let namespace = await namespaceRetriever.getNameSpace("www.gymstxt.com/client.stxt");
	*/
	
	return g_client + "\n" + g_doc_simple + "\n" + doc.toString();
}