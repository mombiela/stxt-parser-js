import { NamespaceChild } from './NamespaceChild.js';

export class NamespaceNode {
    constructor() {
        this.name = '';
        this.type = '';
        this.childs = new Map();
        this.values = new Set();
    }

    getValues() {
        return this.values;
    }

    setValues(values) {
        this.values = values;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getChilds() {
        return this.childs;
    }

    setChilds(childs) {
        this.childs = childs;
    }

    setChild(name, child) {
        this.childs.set(name, child);
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    toString() {
        return `NamespaceNode [name=${this.name}, type=${this.type}, values=${Array.from(this.values)}, childs=${Array.from(this.childs.entries()).map(([key, value]) => `${key}=${value.toString()}`)}]`;
    }
}

