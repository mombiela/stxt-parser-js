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
	return "<h1>" + hash + "</h1><p>Welcome to the page: " + hash + "</p>";
}
