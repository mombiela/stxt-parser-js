import { getUrlContent } from './js/utilsURL.js';
import { uniform } from './js/utilsName.js';
import { cleanupString } from './js/utilsCleanup.js';
import { Type } from './js/type.js';

getUrlContent('https://semantictext.info/es/chapter_02.stxt')
    .then(insertContent).catch(errorContent);

function insertContent(contenido)
{
	document.getElementById('content').innerText = contenido;
}

function errorContent(error)
{
	document.getElementById('content').innerText = "ERROR:\n" + error;
}

// Ejemplo de uso de uniform
const name = " Example Name ";
const uniformName = uniform(name);
console.log(uniformName);  // Salida: "example name"

// Ejemplo de uso de cleanupString
const messyString = "This\tis\na\r\nmessy string with  spaces.";
const cleanedString = cleanupString(messyString);
console.log(cleanedString);  // Salida: "Thisisamessystringwithspaces."

// Ejemplo de uso de Type
console.log(Type.NODE);  // Salida: "NODE"
console.log(Type.URL);   // Salida: "URL"
