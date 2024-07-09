export function makeNavigation(isDir, hashParts) {
	console.log("ISDIR: " + isDir);
	console.log("hashParts: " + hashParts);
	
	return {
		hilo_ariadna: [
			{url:"https://www.semantictext.info", descrip:"Otro"},
			{url:"https://www.google.es", descrip:"Google"},
		],
		prev: {url:"https://www.semantictext.info", descrip:"Previa"},
		next: {url:"https://www.semantictext.info", descrip:"Siguiente"}
	};
}