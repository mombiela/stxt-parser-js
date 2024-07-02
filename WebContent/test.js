import { getUrlContent, getUrlContentCors } from './js/utilsURL.js';
import { testConstants } from './js/Constants.js';
import { testParseException } from './js/ParseException.js';
import { testLineIndent } from './js/LineIndent.js';

const funciones = {
	testConstants, 
	testParseException,
	testLineIndent
}

/* **************** */
/* Carga SPA y test */
/* **************** */

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
    const hash = window.location.hash;
    const content = document.getElementById("content");

    content.innerHTML = await buildContent(hash);
}

async function buildContent(hash)
{
	console.log("Hash = " + hash);
	try
	{
		if (!hash) return "<h1>Inicial</h1>";
		hash = hash.substring(1);
		
		if (funciones[hash]) return await funciones[hash]();
		else return "<h1>NOT FOUND TEST</h1>";
	}
	catch(exception)
	{
		console.log(exception);
		return buildError("Page definition not valid: " + exception);
	}
}

function buildError(message)
{
	return "<h1>" + message + "</h1>"
}

