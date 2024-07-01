import { NamespaceNode } from './NamespaceNode.js';
import { NamespaceNodeChild } from './NamespaceNodeChild.js';
import { Type } from './type.js';
import { ParseException } from './ParseException.js';

export class NodeToGrammar {
    static translate(node, namespace) {
        // Check definitions
        if (node.getCanonicalName() !== "ns_def") {
            const error = `Not a namespace definition: ${node.getCanonicalName()}, ${node.getNamespace()}`;
            throw new ParseException(error);
        }
        
        // Create result
        const result = [];
        
        // Get nodes
        const nodes = node.getChilds();
        for (const n of nodes) {
            const gtype = NodeToGrammar.createGType(n, namespace);
            if (gtype !== null) result.push(gtype);
        }
        
        // Return result
        return result;
    }

    static createGType(node, namespace) {
        // Create result
        const result = new NamespaceNode();
        result.setNamespace(namespace);
        
        // Get attributes of the gtype
        const childs = node.getChilds();
        const alias = [];
        const ccc = [];
        for (const n of childs) {
            if (n.getCanonicalName() === "cn") NodeToGrammar.updateName(result, n.getValue().trim());
            if (n.getCanonicalName() === "a") NodeToGrammar.updateAlias(alias, n.getValue().trim());
            if (n.getCanonicalName() === "type") NodeToGrammar.updateType(result, n.getValue().trim());
            if (n.getCanonicalName() === "ch") NodeToGrammar.updateChild(ccc, n, namespace);
        }
        result.setAlias(NodeToGrammar.createFromArray(alias));
        result.setChilds(NodeToGrammar.createFromArrayNamespaceNode(ccc));

        return result;
    }

    static updateName(gtype, value) {
        gtype.setName(value);
    }

    static updateAlias(alias, value) {
        alias.push(value);
    }

    static updateType(result, value) {
        try {
            result.setNodeType(Type[value.toUpperCase()]);
        } catch (e) {
            throw new ParseException(`Not valid type: ${value}`);
        }
    }
    
    static updateChild(ccc, n, namespace) {
        // Create child
        const result = new NamespaceNodeChild();
        result.setNamespace(namespace);

        // Traverse nodes and insert
        const childs = n.getChilds();
        for (const child of childs) {
            if (child.getCanonicalName() === "n") result.setNum(child.getValue().trim());
            if (child.getCanonicalName() === "ns") result.setNamespace(child.getValue().trim());
            if (child.getCanonicalName() === "cn") result.setType(child.getValue().trim());
        }
        
        // Insert into list
        ccc.push(result);
    }
    
    // -------------------
    // Utility methods
    // -------------------
    
    static createFromArray(alias) {
        return alias;
    }
    
    static createFromArrayNamespaceNode(alias) {
        return alias.length === 0 ? null : alias;
    }
}
