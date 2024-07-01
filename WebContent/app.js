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
	return "<h1>" + hash + "</h1><p>Welcome to the page: " + hash + "</p>";
}
