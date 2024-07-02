import { NodeLine } from './NodeLine.js';

export class Node {
    constructor(line, level, name, value) {
        this.levelCreation = level;
        this.lineCreation = line;
        this.name = name;
        this.value = value;
        this.lines = [];
        this.childs = [];
        this.metadata = {};
        this.multiline = false;
    }

    setMultiline(multiline) {
        this.multiline = multiline;
    }

    isMultiline() {
        return this.multiline;
    }

    getValue() {
        return this.value;
    }

    getMetadata(key) {
        return this.metadata[key];
    }

    setMetadata(key, value) {
        this.metadata[key] = value;
    }

    getChilds() {
        return this.childs;
    }

    addChild(child) {
        this.childs.push(child);
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getLineCreation() {
        return this.lineCreation;
    }

    addLine(value) {
        this.lines.push(value);
    }

    getValues() {
        return this.lines;
    }

    getText() {
        let result = "";

        if (this.value) {
            result += this.value + "\n";
        }
        for (const value of this.lines) {
            result += value.getValue() + "\n";
        }

        return result.replace(/(\s*\r?\n)+$/, "");
    }

    getChildsByName(cname) {
        return this.childs.filter(child => child.getName() === cname);
    }

    getChild(cname) {
        const result = this.getChildsByName(cname);
        if (result.length > 1) throw new Error("More than 1 child. Use getChilds");
        if (result.length === 0) return null;
        return result[0];
    }

    getChildValue(cname) {
        const result = this.getChildsByName(cname);
        if (result.length > 1) throw new Error("More than 1 child. Use getChilds");
        if (result.length === 0) return null;
        return result[0].getValue();
    }

    toString(level = 0) {
        let result = "";

        for (let i = 0; i < level; i++) result += "    ";
        result += `<${this.name}> (line:${this.lineCreation}) ${JSON.stringify(this.metadata)}: '${this.getValueShort()}', lines = ${this.lines}`;
        result += "\n";

        if (this.childs && this.childs.length > 0) {
            for (const child of this.childs) {
                result += child.toString(level + 1);
                result += "\n";
            }
        }

        return result.replace(/\n\n/g, "\n");
    }

    getValueShort() {
        if (this.value == null) return "<NULL>";
        return this.value;
    }

    getLevelCreation() {
        return this.levelCreation;
    }
}

export async function testNode() {
    let result = "";

    const node = new Node(1, 2, "testNode", "nodeValue");
    node.setMultiline(true);
    node.setMetadata("key", "value");
    node.addLine(new NodeLine(1, 2, "lineValue", true));
    node.addChild(new Node(2, 3, "childNode", "childValue"));

    result += `Node Name: ${node.getName()}<br>`;
    result += `Node Value: ${node.getValue()}<br>`;
    result += `Node Line Creation: ${node.getLineCreation()}<br>`;
    result += `Node Level Creation: ${node.getLevelCreation()}<br>`;
    result += `Node is Multiline: ${node.isMultiline()}<br>`;
    result += `Node Metadata (key): ${node.getMetadata("key")}<br>`;
    result += `Node Text: ${node.getText()}<br>`;
    result += `Node ToString: ${node.toString()}<br>`;

    return result;
}
