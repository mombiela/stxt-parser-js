import { getUrlContent } from './utilsURL.js';

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