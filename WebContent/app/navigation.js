export async function makeNavigation(isDir, hashParts) {
	let result = {};
	
	console.log("ISDIR: " + isDir);
	console.log("hashParts: " + hashParts);
	
	result["hilo_ariadna"] = [
			{url:"https://www.semantictext.info", descrip:"Otro"},
			{url:"https://www.google.es", descrip:"Google"},
	];
	
	if (!isDir && hashParts.length > 1)
	{
		let page = "";
		for (let i = 0; i<hashParts.length-1; i++)
		{
			page = page + "/" + hashParts[i];
		}
		page = page + "/index.stxt";
		console.log("INDEX = " + page);
		
		result.prev = {url:"https://www.semantictext.info", descrip:"Previa"};
		result.next = {url:"https://www.semantictext.info", descrip:"Siguiente"};
	}
	
	
	return result;
}