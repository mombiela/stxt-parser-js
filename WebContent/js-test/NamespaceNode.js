import { NamespaceNode } from '../js/NamespaceNode.js';
import { NamespaceChild } from '../js/NamespaceChild.js';


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
