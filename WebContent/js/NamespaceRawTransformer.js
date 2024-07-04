import { Namespace } from './Namespace.js';
import { NamespaceNode } from './NamespaceNode.js';
import { NamespaceChild } from './NamespaceChild.js';
import { NamespaceType, isValidNamespace, isValidType } from './NamespaceType.js';
import { Node } from './Node.js';
import { LineSplitter } from './LineSplitter.js';
import { ParseException } from './ParseException.js';
import { Constants } from './Constants.js';

export class NamespaceRawTransformer {
    static async transformRawNode(node) {
        let currentNamespace = new Namespace();

        // Node name
        let nodeName = node.getName();

        // Validation
        const nodeNameSplit = LineSplitter.split(nodeName);
        nodeName = nodeNameSplit.centralText;

        if (!Constants.NAMESPACE.toLowerCase() === nodeName.toLowerCase()) {
            throw new ParseException("Line not valid: " + nodeName, node.getLineCreation());
        }

        if (nodeNameSplit.suffix !== null) {
            throw new ParseException("Namespace name not allowed in namespace definition: " + nodeNameSplit.suffix, node.getLineCreation());
        }

        if (nodeNameSplit.prefix !== null) {
            throw new ParseException("Line not valid with prefix", node.getLineCreation());
        }

        // Create namespace
        this.validateNamespaceFormat(node.getValue(), node.getLineCreation());
        currentNamespace.setName(node.getValue());

        for (const n of node.getChilds()) {
            await this.updateNamespace(n, currentNamespace);
        }

        // Return namespace
        return currentNamespace;
    }

    // ----
    // Node
    // ----
    
    static async updateNamespace(node, currentNamespace) {
        const name = node.getName();
        let type = null;

        if (node.getValue() !== null) {
            const nodeParts = LineSplitter.split(node.getValue());
            type = nodeParts.centralText;
        }

        // Nodo normal
        let nsNode = currentNamespace.getNode(name);
        if (!nsNode) 
		{
            nsNode = new NamespaceNode();
            nsNode.setName(name);
            nsNode.setType(type);
            currentNamespace.setNode(name, nsNode);
            if (type !== null) this.validateType(type, node);
            if (type === null) nsNode.setType(NamespaceType.getDefault());

            if (node.getValues().length > 0) {
                const allowedValues = new Set();
                for (const value of node.getValues()) {
                    allowedValues.add(value.getValue().trim());
                }

                if (NamespaceType.isValuesType(type)) {
                    nsNode.setValues(allowedValues);
                } else {
                    throw new ParseException("Type not allow values: " + type, node.getLineCreation());
                }
            }
        } else {
            if (type !== null) {
                throw new ParseException("Type should be defined the first time only", node.getLineCreation());
            }
        }

        const childs = node.getChilds();

        if (childs !== null) {
            if (NamespaceType.isMultiline(type) && childs.length > 0) {
                throw new ParseException("Type " + type + " not allows childs", childs[0].getLineCreation());
            }

            for (const child of childs) {
                const childName = child.getName();
                if (childName !== "") {
                    // New child
                    const nsChild = new NamespaceChild();
                    nsNode.getChilds().set(childName, nsChild);

                    // Add name
                    nsChild.setName(childName);

                    // Add count
                    const value = child.getValue();

                    if (value !== null) {
                        // VALUE/PATTERN
                        const split = LineSplitter.split(value);
                        const num = split.prefix;
                        if (num === null) throw new ParseException("Count is required", child.getLineCreation());
                        if (!NamespaceType.isValidCount(num)) throw new ParseException("Count is not valid: " + num, child.getLineCreation());
                        const namespace = split.suffix;
                        nsChild.setNum(num !== null ? num : "*");
                        nsChild.setNamespace(namespace);
                        if (namespace !== null) {
                            if (!isValidNamespace(namespace)) {
                                throw new ParseException("Namespace not valid: " + namespace, child.getLineCreation());
                            }

                            if (split.centralText !== null) {
                                throw new ParseException("Namespace not allow type: " + namespace, child.getLineCreation());
                            }
                        }
                    }

                    // process child (only if not contains namespace!)
                    if (nsChild.getNamespace() === null) {
                        await this.updateNamespace(child, currentNamespace);
                    }
                }
            }
        }
    }

    // -------------------
    // Métodos utilitarios
    // -------------------

    static validateNamespaceFormat(namespace, lineNumber) {
        if (!isValidNamespace(namespace)) {
            throw new ParseException("Namespace not valid: " + namespace, lineNumber);
        }
    }

    static validateType(type, node) {
        if (!isValidType(type)) {
            throw new ParseException("Type not valid: " + type, node.getLineCreation());
        }
    }
}

