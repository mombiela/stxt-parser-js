import { uniform, cleanupString } from '../js/Utils.js';

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
