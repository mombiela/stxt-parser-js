import { getUrlContent, getUrlContentCors } from './js/utilsURL.js';
import { Constants } from './js/Constants.js';
import { ParseException } from './js/ParseException.js';

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

// -----------------
// Funciones de test
// -----------------

const funciones = {
	testConstants, 
	testParseException
}

async function testConstants()
{
	let result = "";
	result += Constants.COMMENT_CHAR + "<br>";
	result += Constants.TAB_SPACES + "<br>";
	result += Constants.TAB + "<br>";
	result += Constants.SPACE + "<br>";  
	result += Constants.SEP_NODE + "<br>";
	result += Constants.ENCODING + "<br>";
	result += Constants.NAMESPACE + "<br>";
	return result;
}

async function testParseException() {
    let result = "";
    try {
        throw new ParseException("An error occurred", 42);
    } catch (e) {
        result += e.message + "<br>"; // Line 42: An error occurred
        result += e.line + "<br>";    // 42
        result += e.name + "<br>";    // ParseException
    }
    return result;
}



