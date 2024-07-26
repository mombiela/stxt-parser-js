import { NamespaceRetriever } from '../js/stxt-parser.js';
import { NamespaceRawTransformer } from '../js/stxt-parser.js';
import { STXTParser } from '../js/stxt-parser.js';
import { Parser } from '../js/stxt-parser.js';
import { Node } from '../js/stxt-parser.js';
import { ParseException } from '../js/stxt-parser.js';
import { getUrlContent } from '../js/stxt-parser.js';

export async function TestParserSTX01Raw()
{
	// Buscamos contents
	let g_client = await getUrlContent("/namespaces/client.stxt");
	let g_doc_simple = await getUrlContent("/namespaces/doc_simple.stxt");
	let client_raw =  await getUrlContent("/docs/client_raw.stxt?ts=" + new Date().getTime());
	console.log(client_raw);
	/*
	let parser = new Parser();
	let doc = (await parser.parse(g_client))[0];
	let ns = await NamespaceRawTransformer.transformRawNode(doc);
	*/

    const namespaceRetriever = new NamespaceRetriever();
	await namespaceRetriever.addGrammarDefinition(g_client);
	await namespaceRetriever.addGrammarDefinition(g_doc_simple);
	let namespace1 = await namespaceRetriever.getNameSpace("www.gymstxt.com/client.stxt");
	let namespace2 = await namespaceRetriever.getNameSpace("www.dokumentando.com/doc_simple.stxt");
	
	let parser = new STXTParser(namespaceRetriever);
	let doc = (await parser.parse(client_raw))[0];
	
	return namespace1 + "\n" + namespace2 + "\n" + client_raw + "\n" + doc;
}