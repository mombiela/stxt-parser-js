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

export async function testNodeLine() {
    let result = "";

    const nodeLine = new NodeLine(1, 2, "test value", true);
    result += `Value: ${nodeLine.getValue()}<br>`;
    result += `Line Creation: ${nodeLine.getLineCreation()}<br>`;
    result += `Level Creation: ${nodeLine.getLevelCreation()}<br>`;
    result += `Is Explicit: ${nodeLine.isExplicit()}<br>`;
    result += `Is Implicit: ${nodeLine.isImplicit()}<br>`;
    result += `ToString: ${nodeLine.toString()}<br>`;

    return result;
}
