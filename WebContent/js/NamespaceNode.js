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

export async function testNamespaceNode() {
    let result = "";

    const node = new NamespaceNode();
    node.setName("NodeName");
    node.setType("NodeType");

    const child1 = new NamespaceChild();
    child1.setName("Child1");
    child1.setNamespace("Namespace1");
    child1.setNum("1");

    const child2 = new NamespaceChild();
    child2.setName("Child2");
    child2.setNamespace("Namespace2");
    child2.setNum("2");

    node.setChild(child1.getName(), child1);
    node.setChild(child2.getName(), child2);

    node.setValues(new Set(["value1", "value2", "value3"]));

    result += `Name: ${node.getName()}<br>`;
    result += `Type: ${node.getType()}<br>`;
    result += `Values: ${Array.from(node.getValues()).join(", ")}<br>`;
    result += `Childs: ${Array.from(node.getChilds().values()).map(child => child.toString()).join(", ")}<br>`;
    result += `ToString: ${node.toString()}<br>`;

    return result;
}
