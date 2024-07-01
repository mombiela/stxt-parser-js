import { Type } from './type.js';
import { NamespaceNodeChild } from './NamespaceNodeChild.js';

export class NamespaceNode {
    constructor(name = '', namespace = '', alias = [], nodeType = null, childs = []) {
        this.name = name;
        this.namespace = namespace;
        this.alias = alias;
        this.nodeType = nodeType;
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

    getAlias() {
        return this.alias;
    }

    setAlias(alias) {
        this.alias = alias;
    }

    getNodeType() {
        return this.nodeType;
    }

    setNodeType(nodeType) {
        this.nodeType = nodeType;
    }

    getChilds() {
        return this.childs;
    }

    setChilds(childs) {
        this.childs = childs;
    }

    toString() {
        return `NamespaceNode [name=${this.name}, namespace=${this.namespace}, nodeType=${this.nodeType}, alias=${JSON.stringify(this.alias)}, childs=${JSON.stringify(this.childs)}]`;
    }
}
