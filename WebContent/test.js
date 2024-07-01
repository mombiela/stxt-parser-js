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
		if (hash == "#test1")		return await test1();
		else if (hash == "#test2")	return await test2();
		else return "<h1>NOT FOUND TEST</h1>";
	}
	catch(exception)
	{
		return buildError("Page definition not valid");
	}
}

function buildError(message)
{
	return "<h1>" + message + "</h1>"
}

// -----------------
// Funciones de test
// -----------------

async function test1()
{
	return "<h1>TEST 1 OK</h1><p>TEST 1 OK</p>";
}

async function test2()
{
	return "<h1>TEST 2 OK</h1><p>TEST 2 OK</p>";
}

