import { getUrlContent, getUrlContentCors } from './js/utilsURL.js';
import { testConstants } from './js/Constants.js';
import { testParseException } from './js/ParseException.js';
import { testLineIndent } from './js/LineIndent.js';
import { testLineSplitter } from './js/LineSplitter.js';
import { testNodeLine } from './js/NodeLine.js';
import { testNode } from './js/Node.js';

const funciones = {
	testConstants, 
	testParseException,
	testLineIndent,
	testLineSplitter,
	testNodeLine,
	testNode
}

/* **************** */
/* Carga SPA y test */
/* **************** */

document.addEventListener("DOMContentLoaded", ContentLoaded);

async function ContentLoaded()
{
	// A�adimos botones
	for (let x in funciones)
	{
		let link = $("<a href='#" + x + "'>" + x + "</a>").appendTo("#nav");
	}	
	
    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);

    // Cargar la p�gina correcta al cargar la p�gina inicial
    await loadPage();
} 

// Funci�n para cargar la p�gina correcta basada en el hash
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
		if (!hash)
		{
			let total = "";
			for (let x in funciones)
			{
				total += "************ " + x + " ***************\n";
				total += await funciones[x]();
				total += "\n"
			}	
			return total;
		}
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

