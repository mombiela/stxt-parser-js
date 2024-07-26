import { getUrlContent, ParseException, Node, Parser, STXTParser, NamespaceRawTransformer, NamespaceRetriever } from '../js/stxt-parser.js';

export async function TestParserSTX01()
{
	// Buscamos contents
	let g_client = await getUrlContent("/namespaces/client.stxt");
	let g_doc_simple = await getUrlContent("/namespaces/doc_simple.stxt");
	let client =  await getUrlContent("/docs/client.stxt?ts=" + new Date().getTime());
	console.log(client);
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
	let doc = (await parser.parse(client))[0];
	
	return namespace1 + "\n" + namespace2 + "\n" + client + "\n" + doc;
}