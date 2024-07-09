import { getUrlContent, getUrlContentCors } from '../js/Utils.js';
import { STXTParser } from '../js/STXTParser.js';

export async function makeNavigation(isDir, hashParts, parser) {
	let result = {};
	
	console.log("ISDIR: " + isDir);
	console.log("hashParts: " + hashParts);
	
	result["hilo_ariadna"] = [
			{url:"https://www.semantictext.info", descrip:"Otro"},
			{url:"https://www.google.es", descrip:"Google"},
	];
	
	let indexDocs = [];
	if (hashParts.length > 1)
	{
		let page = "";
		for (let i = 0; i<hashParts.length-1; i++)
		{
			try
			{
				page = page + "/" + hashParts[i];
				console.log("BUSCAR: " + page + "/index.stxt");
				let indexDoc = await getUrlContent(page + "/index.stxt"); // TODO Hay que hacerlo bien, con dominio, cors si es necesario, etc
				console.log(indexDoc);
				const node = (await parser.parse(indexDoc))[0];
				console.log(node.toString());
			}
			catch (e)
			{
				console.log("ERROR PAGE: " + page + "\n" + e);
			}
		}
	}
	
	if (!isDir)
	{
		result.prev = {url:"https://www.semantictext.info", descrip:"<< Previa"};
		result.next = {url:"https://www.semantictext.info", descrip:"Siguiente >>"};
	}
	
	
	return result;
}