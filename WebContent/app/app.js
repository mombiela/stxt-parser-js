import { getUrlContent } from '../js/Utils.js';
import { STXTParser } from '../js/STXTParser.js';
import { NamespaceRetriever } from '../js/NamespaceRetriever.js';
import { transform } from './transform.js';
import { makeNavigation } from './navigation.js';
import { esDominioValido } from './utils.js';

document.addEventListener("DOMContentLoaded", ContentLoaded);

let grammar1 = `Namespace: www.cursos.com/tema.stxt
	Tema:
		h1: (?)
		h2: (*)
		h3: (*)
		text: (*) TEXT
		code: (*) TEXT
		plantuml: (*) TEXT
		assert: (*) TEXT
		alert: (*) TEXT`;
		
let grammar2 = `Namespace: www.cursos.com/index.stxt
	Index:
		title: (1)
		part: (+)
			tema: (+)`;

async function ContentLoaded()
{
    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);

    // Cargar la página correcta al cargar la página inicial
    await loadPage();
} 

// Funci�n para cargar la página correcta basada en el hash
async function loadPage() 
{
    const hash = window.location.hash || "#index";
    await buildContent(hash);
}

async function buildContent(hashIni)
{
    const content = $("#content");
    content.empty();
	try
	{
		// Validamos que empieze por "#"
		let hash = hashIni;
		if (!hash.startsWith("#")) return buildError("Page not valid");
		hash = hash.substring(1);
		
		// Is dir?
		const isDir = hash.endsWith("/");
		if (isDir) hash = hash.substring(0, hash.length -1);
		
		// Miramos si es local o remota y que tenga params v�lidos
		const hashParts = hash.split("/");
		
		// Miramos tamaño máximo
		if (hashParts.length > 5)  return buildError("Page definition not valid");
		
		// Miramos partes
		let stxtUrl = hashParts[0];
		let startIndex = 1;
		if (esDominioValido(stxtUrl))
		{
			stxtUrl = "https://" + stxtUrl;	
		}
		else if (hashParts.length >=3 && hashParts[0]=="github")
		{
			stxtUrl = "https://raw.githubusercontent.com/" + hashParts[1] + "/" + hashParts[2] + "/master/";
			startIndex = 3;
		}
		else if (esNombrePaginaValido(stxtUrl))
		{
			stxtUrl = obtenerBaseURL() + "/" + stxtUrl;	
		}
		else
		{
			return buildError("Page definition not valid");			
		}
		
		// Miramos otras partes
		for (let i = startIndex; i<hashParts.length; i++)
		{
			if (hashParts[i].length == 0) throw new Exception();
			stxtUrl = stxtUrl + "/" + hashParts[i]; 
		}
		
		// Miramos final
		if (isDir)	stxtUrl += "/index.stxt";
		else     	stxtUrl += ".stxt";
		
		// Obtenemos content
		console.log("URL = " + stxtUrl);
		let contentFromUrl = await getUrlContent(stxtUrl + "?ts=" + new Date().getTime());
		
		// Final
	    const namespaceRetriever = new NamespaceRetriever();
		await namespaceRetriever.addGrammarDefinition(grammar1);
		await namespaceRetriever.addGrammarDefinition(grammar2);
		const parser = new STXTParser(namespaceRetriever);
		const node = (await parser.parse(contentFromUrl))[0];
		
		// Make navigation
		const navigation = await makeNavigation(isDir, hashParts, parser);

		// Transform page
		transform(hashIni, node, navigation);
		plantuml_runonce();
		
		// Insertamos en fuente
		$("#link_source_code").attr("href", stxtUrl);
	}
	catch(exception)
	{
		console.log("Error: " + exception);
		content.append($("<pre>").text("Page definition not valid: " + exception));
	}
}

// --------------------
// Funciones auxiliares
// --------------------

function buildError(message)
{
	return "<h1>" + message + "</h1>"
}

function esNombrePaginaValido(pagina) 
{
    // Expresi�n regular para verificar p�gina v�lida
    const regexDominio = /^[a-zA-Z0-9-_]+$/;
    return regexDominio.test(pagina);
}

function obtenerBaseURL() {
    const url = window.location;
    return `${url.protocol}//${url.host}`;
}
