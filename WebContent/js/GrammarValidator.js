import { NamespaceNode } from './NamespaceNode.js';
import { Type } from './type.js';

export class GrammarValidator {
    static validateGrammar(grammar) {
        for (const namespaceNode of grammar) {
            if (!this.validateNamespaceNode(namespaceNode)) {
                return false;
            }
        }
        return true;
    }

    static validateNamespaceNode(namespaceNode) {
        if (!(namespaceNode instanceof NamespaceNode)) {
            console.error('Invalid node type:', namespaceNode);
            return false;
        }

        if (!namespaceNode.getName() || !namespaceNode.getNamespace() || !namespaceNode.getNodeType()) {
            console.error('Missing required properties in namespace node:', namespaceNode);
            return false;
        }

        const validTypes = Object.values(Type);
        if (!validTypes.includes(namespaceNode.getNodeType())) {
            console.error('Invalid node type in namespace node:', namespaceNode.getNodeType());
            return false;
        }

        const childs = namespaceNode.getChilds();
        if (childs) {
            for (const child of childs) {
                if (!this.validateNamespaceNodeChild(child)) {
                    return false;
                }
            }
        }

        return true;
    }

    static validateNamespaceNodeChild(child) {
        if (!child.getType() || !child.getNamespace() || !child.getNum()) {
            console.error('Missing required properties in namespace node child:', child);
            return false;
        }
        return true;
    }
}
