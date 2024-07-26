import { NamespaceNode } from './NamespaceNode.js';
import { NamespaceChild } from './NamespaceChild.js';

export class Namespace {
    constructor() {
        this.nodes = new Map();
        this.name = '';
    }

    getNodes() {
        return this.nodes;
    }

    getNode(name) {
        return this.nodes.get(name);
    }

    setNode(name, node) {
        this.nodes.set(name, node);
    }

    setNodes(nodes) {
        this.nodes = new Map(Object.entries(nodes));
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    toString() {
        let builder = `Namespace: ${this.name}\n`;
        for (const [nodeName, node] of this.nodes.entries()) {
            builder += `NODE: ${node.getName()}, type: ${node.getType()} -> ${Array.from(node.getValues()).join(", ")}\n`;
            for (const [childName, child] of node.getChilds().entries()) {
                builder += `\tChild: ${child.toString()}\n`;
            }
        }
        return builder;
    }
}

