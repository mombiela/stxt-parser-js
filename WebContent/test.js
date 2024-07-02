import { testUtils } from './js/Utils.js';
import { testConstants } from './js/Constants.js';
import { testParseException } from './js/ParseException.js';
import { testLineIndent } from './js/LineIndent.js';
import { testLineSplitter } from './js/LineSplitter.js';
import { testNodeLine } from './js/NodeLine.js';
import { testNode } from './js/Node.js';
import { testProcessor } from './js/Processor.js';
import { testParser } from './js/Parser.js';
import { testRawCustomProcessor } from './js/RawCustomProcessor.js';
import { testNamespaceType } from './js/NamespaceType.js';
import { testNamespaceChild } from './js/NamespaceChild.js';
import { testNamespaceNode } from './js/NamespaceNode.js';
import { testNamespace } from './js/Namespace.js';

const funciones = {
	testUtils,
	testConstants, 
	testParseException,
	testLineIndent,
	testLineSplitter,
	testNodeLine,
	testNode,
	testProcessor,
	testParser,
	testRawCustomProcessor,
	testNamespaceType,
	testNamespaceChild,
	testNamespaceNode,
	testNamespace
}

/* **************** */
/* Carga SPA y test */
/* **************** */

document.addEventListener("DOMContentLoaded", ContentLoaded);

async function ContentLoaded()
{
	// Añadimos botones
	for (let x in funciones)
	{
		let link = $("<a href='#" + x + "'>" + x + "</a>").appendTo("#nav");
	}	
	
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
		if (!hash)
		{
			let total = "";
			try
			{
				for (let x in funciones)
				{
					total += "************ " + x + " ***************\n";
					total += await funciones[x]();
					total += "\n"
				}
			}
			catch (e)
			{
				total += "\nERROR: " + e;
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

