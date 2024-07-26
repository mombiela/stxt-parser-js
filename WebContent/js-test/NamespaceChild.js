import { NamespaceChild } from '../js/stxt-parser.js';

export async function testNamespaceChild() {
    let result = "";

    const child = new NamespaceChild();
    child.setName("ChildName");
    child.setNamespace("ChildNamespace");
    child.setNum("123");

    result += `Name: ${child.getName()}<br>`;
    result += `Namespace: ${child.getNamespace()}<br>`;
    result += `Num: ${child.getNum()}<br>`;
    result += `ToString: ${child.toString()}<br>`;

    return result;
}
