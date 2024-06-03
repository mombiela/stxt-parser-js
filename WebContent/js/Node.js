import { Type } from './type.js';

export class Node {
    constructor() {
        this.name = '';
        this.canonicalName = '';
        this.namespace = '';
        this.type = null;
        this.value = '';
        this.childs = [];
        this.lineCreation = 0;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getValue() {
        return this.value;
    }

    getTvalue() {
        return this.value ? this.value.trim() : '';
    }

    setValue(value) {
        this.value = value;
    }

    getChilds() {
        return this.childs;
    }

    setChilds(childs) {
        this.childs = childs;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getNamespace() {
        return this.namespace;
    }

    setNamespace(namespace) {
        this.namespace = namespace;
    }

    getCanonicalName() {
        return this.canonicalName;
    }

    setCanonicalName(canonicalName) {
        this.canonicalName = canonicalName;
    }

    getLineCreation() {
        return this.lineCreation;
    }

    setLineCreation(lineCreation) {
        this.lineCreation = lineCreation;
    }

    toString() {
        return this._toString(1);
    }

    _toString(level) {
        let result = `<Node> name=${this.name}, canonicalName=${this.canonicalName}, namespace=${this.namespace}, lineCreation=${this.lineCreation}, type=${this.type}, value=${this.value}, childs=`;
        if (this.childs.length === 0) {
            result += '[]';
        } else {
            result += '\n';
            this.childs.forEach((c, j) => {
                result += '\t'.repeat(level);
                result += `[${j}]${c._toString(level + 1)}`;
                if (j !== this.childs.length - 1) result += '\n';
            });
        }
        return result;
    }

    toSTXT() {
        return this._toSTXT(1);
    }

    _toSTXT(level) {
        let result = `${this.canonicalName}${level === 1 ? `(${this.namespace})` : ''}:`;
        if (this.type !== Type.NODE) {
            result += this._tabulatedText(this.value, level);
        }
        if (this.childs.length > 0) {
            result += '\n';
            this.childs.forEach((c, j) => {
                result += '\t'.repeat(level);
                result += c._toSTXT(level + 1);
                if (j !== this.childs.length - 1) result += '\n';
            });
        }
        return result;
    }

    _tabulatedText(text, level) {
        if (text.indexOf('\n') === -1) return text;
        const tab = '\t'.repeat(level);
        return text.replace(/\n/g, '\n' + tab);
    }

    toSTXTCompact() {
        return this._toSTXTCompact(1);
    }

    _toSTXTCompact(level) {
        let result = `${this.canonicalName}${level === 1 ? `(${this.namespace})` : ''}:`;
        if (this.type !== Type.NODE) {
            result += this._compactTabulatedText(this.value, level);
        }
        if (this.childs.length > 0) {
            result += '\n';
            this.childs.forEach((c, j) => {
                result += `${level}:`;
                result += c._toSTXTCompact(level + 1);
                if (j !== this.childs.length - 1) result += '\n';
            });
        }
        return result;
    }

    _compactTabulatedText(text, level) {
        if (text.indexOf('\n') === -1) return text;
        if (this.type !== Type.TEXT) text = text.trim();
        return text.replace(/\n/g, `\n${level}:`);
    }

    getChildsByName(cname) {
        return this.childs.filter(child => child.getCanonicalName().toLowerCase() === cname.toLowerCase());
    }

    getChild(cname) {
        const result = this.getChildsByName(cname);
        if (result.length > 1) throw new Error("More than 1 child. Use getChilds");
        return result.length === 0 ? null : result[0];
    }
}
