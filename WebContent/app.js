document.addEventListener("DOMContentLoaded", ContentLoaded);

async function ContentLoaded()
{
    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);

    // Cargar la p�gina correcta al cargar la p�gina inicial
    await loadPage();
} 

// Funci�n para cargar la p�gina correcta basada en el hash
async function loadPage() 
{
    const hash = window.location.hash || "#home";
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
		
		// Miramos si es local o remota y que tenga params v�lidos
		let hashParts = hash.split("/");
		
		// Miramos tama�o m�ximo
		if (hashParts.length > 3)  return buildError("Page definition not valid");
		
		// Miramos partes
		let stxtUrl = hashParts[0];
		if (esDominioValido(stxtUrl))				stxtUrl = "https://" + stxtUrl;
		else if (esNombrePaginaValido(stxtUrl))		stxtUrl = obtenerBaseURL() + "/" + stxtUrl;
		else										return buildError("Page definition not valid");
		
		// Final
		return "<h1>" + hash + "</h1><p>" + stxtUrl + "</p>";
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
    // Expresi�n regular para verificar nombres de dominio v�lidos
    const regexDominio = /^([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
    return regexDominio.test(dominio);
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
