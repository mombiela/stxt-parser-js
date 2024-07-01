import { Node } from './Node.js';
import { NamespaceNode } from './NamespaceNode.js';

export class NodeValidator {
    static validateNode(node, grammar) {
        for (const namespaceNode of grammar) {
            if (namespaceNode.getName() === node.getCanonicalName()) {
                return this.validateNodeAgainstNamespace(node, namespaceNode);
            }
        }
        console.error('No matching namespace definition found for node:', node);
        return false;
    }

    static validateNodeAgainstNamespace(node, namespaceNode) {
        const childs = namespaceNode.getChilds();
        if (!childs) {
            return true;
        }

        const childNodes = node.getChilds();
        for (const child of childs) {
            const matchingChildNodes = childNodes.filter(childNode => childNode.getCanonicalName() === child.getType());
            if (!this.validateChildMultiplicity(matchingChildNodes, child.getNum())) {
                return false;
            }
            for (const matchingChildNode of matchingChildNodes) {
                if (!this.validateNodeAgainstNamespace(matchingChildNode, namespaceNode)) {
                    return false;
                }
            }
        }

        return true;
    }

    static validateChildMultiplicity(childNodes, multiplicity) {
        switch (multiplicity) {
            case '1':
                return childNodes.length === 1;
            case '*':
                return childNodes.length >= 0;
            case '+':
                return childNodes.length > 0;
            case '?':
                return childNodes.length <= 1;
            default:
                console.error('Invalid multiplicity:', multiplicity);
                return false;
        }
    }
}
