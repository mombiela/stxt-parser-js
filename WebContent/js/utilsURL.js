export async function getUrlContent(url) {
    const headers = new Headers({
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept": "text/html"
    });

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
}

export async function getUrlContentCors(url) {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
}