export async function getUrlContent(url) {
    const headers = new Headers({
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

export function uniform(name) {
    return name.trim().toLowerCase();
}

export function cleanupString(input) {
    return input.replace(/[\r\n\t]+|\s+/g, '');
}

