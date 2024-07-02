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
export function uniform(name) {
    return name.trim().toLowerCase();
}

export function cleanupString(input) {
    return input.replace(/[\r\n\t]+|\s+/g, '');
}

export async function testUtils() {
    let result = "";

    // Test the uniform function
    const uniformTest = "  Test String  ";
    result += `Uniform: ${uniform(uniformTest)}<br>`;

    // Test the cleanupString function
    const cleanupTest = " This\tis \na \t test \r string ";
    result += `Cleanup: ${cleanupString(cleanupTest)}<br>`;

    // Test the getUrlContent function (disabled due to CORS issues in browser environment)
    const url = "https://example.com";
    try {
        const content = await getUrlContent(url);
        result += `Content fetched from URL: ${content.substring(0, 100)}<br>`; // Showing first 100 characters
    } catch (e) {
        result += `Error fetching URL content: ${e.message}<br>`;
    }

    return result;
}
