document.addEventListener("DOMContentLoaded", () => {
    // Función para cargar la página correcta basada en el hash
    function loadPage() {
        const hash = window.location.hash || "#home";
        const content = document.getElementById("content");

        content.innerHTML = buildContent(hash);
    }

    // Cargar la página correcta al cargar la página inicial
    loadPage();

    // Escuchar los cambios en el hash de la URL
    window.addEventListener("hashchange", loadPage);
});

function buildContent(hash)
{
	// Validamos que empieze por "#"
	if (!hash.startsWith("#")) return buildError("Page not valid");
	hash = hash.substring(1);
	
	// Miramos si es local o remota y que tenga params válidos
	let hashParts = hash.split("/");
	
	// Miramos tamaño máximo
	if (hashParts.length > 3)  return buildError("Page definition not valid");
	
	return "<h1>" + hash + "</h1><p>Welcome to the page: " + hashParts + "</p>";
}

function buildError(message)
{
	return "<h1>" + message + "</h1>"
}

function esDominioValido(dominio) 
{
    // Expresión regular para verificar nombres de dominio válidos
    const regexDominio = /^([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/;
    return regexDominio.test(dominio);
}

function esNombrePaginaValido(pagina) 
{
    // Expresión regular para verificar página válida
    const regexDominio = /^[a-zA-Z0-9-_]+$/;
    return regexDominio.test(pagina);
}
