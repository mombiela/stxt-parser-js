export class NamespaceChild {
    constructor() {
        this.name = '';
        this.namespace = '';
        this.num = '';
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

    getNum() {
        return this.num;
    }

    setNum(num) {
        this.num = num;
    }

    toString() {
        let builder = `NamespaceChild [name=${this.name}, num=${this.num}`;
        if (this.namespace) {
            builder += `, namespace=${this.namespace}`;
        }
        builder += "]";
        return builder;
    }
}

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
