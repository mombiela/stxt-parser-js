export function cleanupString(input) {
    return input.replace(/[\r\n\t]+|\s+/g, "");
}
