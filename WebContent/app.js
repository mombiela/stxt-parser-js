import { getUrlContent, getUrlContentCors } from './js/utilsURL.js';

document.addEventListener("DOMContentLoaded", ContentLoaded);

async function ContentLoaded()
{
    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);

    // Cargar la página correcta al cargar la página inicial
    await loadPage();
} 

// Función para cargar la página correcta basada en el hash
async function loadPage() 
{
    const hash = window.location.hash || "#index";
    const content = document.getElementById("content");

    content.innerHTML = await buildContent(hash);
}

async function buildContent(hash)
{
	try
	{
		// Validamos que empieze por "#"
		if (!hash.startsWith("#")) return buildError("Page not valid");
		hash = hash.substring(1);
		
		// Is dir?
		let isDir = hash.endsWith("/");
		if (isDir) hash = hash.substring(0, hash.length -1);
		
		// Miramos si es local o remota y que tenga params válidos
		let hashParts = hash.split("/");
		
		// Miramos tamaño máximo
		if (hashParts.length > 5)  return buildError("Page definition not valid");
		
		// Miramos partes
		let stxtUrl = hashParts[0];
		if (esDominioValido(stxtUrl))				stxtUrl = "https://" + stxtUrl;
		else if (esNombrePaginaValido(stxtUrl))		stxtUrl = obtenerBaseURL() + "/" + stxtUrl;
		else										return buildError("Page definition not valid");
		
		// Miramos otras partes
		for (let i = 1; i<hashParts.length; i++)
		{
			if (hashParts[i].length == 0) throw new Exception();
			stxtUrl = stxtUrl + "/" + hashParts[i]; 
		}
		
		// Miramos final
		if (isDir)	stxtUrl += "/index.stxt";
		else     	stxtUrl += ".stxt";
		
		// Obtenemos content
		let contentFromUrl = "";
		
		if (esDominioValido(hashParts[0]))	contentFromUrl = await getUrlContentCors(stxtUrl);
		else 								contentFromUrl = await getUrlContent(stxtUrl);
		
		// Final
		return "<h1>" + hash + "</h1><p>" + stxtUrl + "</p>" + "<pre>" + contentFromUrl + "</pre>";
	}
	catch(exception)
	{
		return buildError("Page definition not valid");
	}
}

// --------------------
// Funciones auxiliares
// --------------------

function buildError(message)
{
	return "<h1>" + message + "</h1>"
}

function esDominioValido(dominio) 
{
    // Expresión regular para verificar nombres de dominio válidos
    const regexDominio = /^([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
    return regexDominio.test(dominio);
}

function esNombrePaginaValido(pagina) 
{
    // Expresión regular para verificar página válida
    const regexDominio = /^[a-zA-Z0-9-_]+$/;
    return regexDominio.test(pagina);
}

function obtenerBaseURL() {
    const url = window.location;
    return `${url.protocol}//${url.host}`;
}
