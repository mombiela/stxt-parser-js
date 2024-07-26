import { testUtils } from './js-test/Utils.js';
import { testConstants } from './js-test/Constants.js';
import { testParseException } from './js-test/ParseException.js';
import { testLineIndent } from './js-test/LineIndent.js';
import { testLineSplitter } from './js-test/LineSplitter.js';
import { testNodeLine } from './js-test/NodeLine.js';
import { testNode } from './js-test/Node.js';
import { testProcessor } from './js-test/Processor.js';
import { testParser } from './js-test/Parser.js';
import { testRawCustomProcessor } from './js-test/RawCustomProcessor.js';
import { testNamespaceType } from './js-test/NamespaceType.js';
import { testNamespaceChild } from './js-test/NamespaceChild.js';
import { testNamespaceNode } from './js-test/NamespaceNode.js';
import { testNamespace } from './js-test/Namespace.js';
import { testNamespaceValidator } from './js-test/NamespaceValidator.js';
import { testNamespaceRawTransformer } from './js-test/NamespaceRawTransformer.js';
import { testNamespaceRetriever } from './js-test/NamespaceRetriever.js';
import { testSTXTProcessor } from './js-test/STXTProcessor.js';
import { testSTXTParser } from './js-test/STXTParser.js';
import { TestParserSTX01Raw } from './js-test/TestParserSTX01Raw.js';
import { TestParserSTX01 } from './js-test/TestParserSTX01.js';

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
	testNamespace,
	testNamespaceValidator,
	testNamespaceRawTransformer,
	testNamespaceRetriever,
	testSTXTProcessor,
	testSTXTParser,
	TestParserSTX01Raw,
	TestParserSTX01
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
				total = "******\nALL OK\n******\n\n" + total;
			}
			catch (e)
			{
				console.log(e);
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

