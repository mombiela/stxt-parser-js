import { Namespace,NamespaceNode,NamespaceChild } from '../js/stxt-parser.js';

export async function testNamespace() {
    let result = "";

    const namespace = new Namespace();
    namespace.setName("TestNamespace");

    const node1 = new NamespaceNode();
    node1.setName("Node1");
    node1.setType("Type1");

    const child1 = new NamespaceChild();
    child1.setName("Child1");
    child1.setNamespace("Namespace1");
    child1.setNum("1");

    node1.setChild(child1.getName(), child1);
    node1.setValues(new Set(["value1", "value2"]));

    const node2 = new NamespaceNode();
    node2.setName("Node2");
    node2.setType("Type2");

    const child2 = new NamespaceChild();
    child2.setName("Child2");
    child2.setNamespace("Namespace2");
    child2.setNum("2");

    node2.setChild(child2.getName(), child2);
    node2.setValues(new Set(["value3", "value4"]));

    namespace.setNode(node1.getName(), node1);
    namespace.setNode(node2.getName(), node2);

    result += `Namespace Name: ${namespace.getName()}<br>`;
    result += `Nodes: ${Array.from(namespace.getNodes().values()).map(node => node.toString()).join("<br>")}<br>`;
    result += `ToString: ${namespace.toString().replace(/\n/g, "<br>")}<br>`;

    return result;
}
