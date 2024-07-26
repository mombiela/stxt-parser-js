export class NodeLine {
    constructor(line, level, value, explicit) {
        this.lineCreation = line;
        this.levelCreation = level;
        this.value = value;
        this.explicit = explicit;
    }

    getValue() {
        return this.value;
    }

    getLineCreation() {
        return this.lineCreation;
    }

    getLevelCreation() {
        return this.levelCreation;
    }

    isExplicit() {
        return this.explicit;
    }

    isImplicit() {
        return !this.explicit;
    }

    toString() {
        return `NodeValue [value=${this.value}, line=${this.lineCreation}, ${this.explicit ? 'explicit' : 'implicit'}]`;
    }
}

