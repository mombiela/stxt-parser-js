document.addEventListener("DOMContentLoaded", () => {
    // Funci�n para cargar la p�gina correcta basada en el hash
    function loadPage() {
        const hash = window.location.hash || "#home";
        const content = document.getElementById("content");

        content.innerHTML = buildContent(hash);
    }

    // Cargar la p�gina correcta al cargar la p�gina inicial
    loadPage();

    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);
});

function buildContent(hash)
{
	// Validamos que empieze por "#"
	if (!hash.startsWith("#")) return buildError("Page not valid");
	hash = hash.substring(1);
	
	// Miramos si es local o remota y que tenga params v�lidos
	let hashParts = hash.split("/");
	
	// Miramos tama�o m�ximo
	if (hashParts.length > 3)  return buildError("Page definition not valid");
	
	return "<h1>" + hash + "</h1><p>Welcome to the page: " + hashParts + "</p>";
}

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
