export class NamespaceNodeChild {
    constructor(type = '', namespace = '', num = '') {
        this.type = type;
        this.namespace = namespace;
        this.num = num;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
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
        return `NamespaceNodeChild [type=${this.type}, namespace=${this.namespace}, num=${this.num}]`;
    }
}
