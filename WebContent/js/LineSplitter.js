export class LineSplitter {
    constructor(prefix, centralText, suffix) {
        this.prefix = prefix;
        this.centralText = centralText;
        this.suffix = suffix;
    }

    getPrefix() {
        return this.prefix;
    }

    getCentralText() {
        return this.centralText;
    }

    getSuffix() {
        return this.suffix;
    }

    static split(input) {
        let prefix, centralText, suffix;
        
        const pattern = /(\(([^)]*)\))?(.*?)(\(([^)]*)\))?$/;
        const matcher = input.match(pattern);
        
        if (matcher) {
            prefix = matcher[2] ? matcher[2].trim() : null;
            centralText = matcher[3] ? matcher[3].trim() : null;
            suffix = matcher[5] ? matcher[5].trim() : null;
        } else {
            centralText = input.trim();
            prefix = null;
            suffix = null;
        }
        if (centralText && centralText.length == 0) centralText = null;
        
        return new LineSplitter(prefix, centralText, suffix);
    }
}

