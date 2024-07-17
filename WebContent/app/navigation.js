import { getUrlContent, getUrlContentCors } from '../js/Utils.js';
import { STXTParser } from '../js/STXTParser.js';
import { LineSplitter } from '../js/LineSplitter.js';

export async function makeNavigation(isDir, hashParts, parser) {
	let result = {};
	
	console.log("ISDIR: " + isDir);
	console.log("hashParts: " + hashParts);
	
	let indexDocs = [];
	if (hashParts.length >= 1)
	{
		let page = "";
		for (let i = 0; i<hashParts.length; i++)
		{
			try
			{
				page = page + "/" + hashParts[i];
				console.log("BUSCAR: " + page + "/index.stxt");
				let indexDoc = await getUrlContent(page + "/index.stxt"); // TODO Hay que hacerlo bien, con dominio, cors si es necesario, etc
				console.log(indexDoc);
				const node = (await parser.parse(indexDoc))[0];
				indexDocs.push(node);
			}
			catch (e)
			{
				console.log("ERROR PAGE: " + page + "\n" + e);
			}
		}
	}

	// TODO Eliminar
	for (let i = 0; i<indexDocs.length; i++)
	{
		console.log(indexDocs[i].toString());
	}	

	// Hilo Ariadna
	let hiloAriadna = [{url: "#", descrip: "Global Campus"}];
	
	let last = "#";
	for (let i = 0; i<indexDocs.length; i++)
	{
		let node = indexDocs[i];
		let nextElem = {};
		last = last + hashParts[i] + "/";
		nextElem.url = last;
		nextElem.descrip = node.getChild("title").getText();
		hiloAriadna.push(nextElem);
	}	
	
	result["hilo_ariadna"] = hiloAriadna;


	// Previous y next
	if (!isDir && indexDocs.length>=1)
	{
		let lastDoc = indexDocs[indexDocs.length-1];
		let allDocs = [];
		
		let parts = lastDoc.getChildsByName("part");
		for (let i = 0; i<parts.length; i++)
		{
			let temas = parts[i].getChildsByName("tema");
			for (let j = 0; j<temas.length; j++)
			{
				let tema = temas[j];
				allDocs.push(tema);
			}
		}
		
		//console.log("LAST DOC: \n" + lastDoc);
		let lastPart = hashParts[hashParts.length-1];
		console.log("LAST PART = " + lastPart);
		for (let i = 0; i<allDocs.length; i++)
		{
			let tema = allDocs[i];
			let temaUrl = LineSplitter.split(tema.getText()).prefix;
			if (temaUrl == lastPart)
			{
				console.log("TEMA! = " + tema + " -> " + last + lastPart);
				
				if (i>0)
				{
					tema = allDocs[i-1];
					temaUrl = LineSplitter.split(tema.getText()).prefix;
					let temaDesc = LineSplitter.split(tema.getText()).centralText;
					result.prev = {url:last + temaUrl, descrip: "<< " + temaDesc};
				}
				if (i<allDocs.length-1)
				{
					tema = allDocs[i+1];
					temaUrl = LineSplitter.split(tema.getText()).prefix;
					let temaDesc = LineSplitter.split(tema.getText()).centralText;
					result.next = {url:last + temaUrl, descrip: temaDesc + " >>"};
				}
			}
		}
				
	}

	
	return result;
}