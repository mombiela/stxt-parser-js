import { NamespaceRetriever } from './NamespaceRetriever.js';
import { NamespaceValidator } from './NamespaceValidator.js';
import { NamespaceType } from './NamespaceType.js';
import { LineSplitter } from './LineSplitter.js';
import { ParseException } from './ParseException.js';
import { Node } from './Node.js';

const NAMESPACE = "namespace";

export class STXTProcessor {
    constructor(namespaceRetriever) {
        this.namespaceRetriever = namespaceRetriever;
        this.currentDocRaw = false;
    }

    async processNodeOnCreation(node) {
        if (node.getLevelCreation() === 0) {
            await this.updateMainNamespace(node);
        }
    }

    async processNodeOnCompletion(node) {
        if (this.currentDocRaw) return; // No process

        const namespace = node.getMetadata(NAMESPACE);
        const nsNode = (await this.namespaceRetriever.getNameSpace(namespace)).getNode(node.getName());

        await NamespaceValidator.validateCount(nsNode, node);

        // Validamos nodo
        await NamespaceValidator.validateValue(nsNode, node);

        // Validamos no implicit multiline
        this.validateNotImplicitMultiline(node);
    }

    async processBeforeAdd(parent, child) {
        if (this.currentDocRaw) return; // No process

        // Get namespace parent
        const parentNamespace = parent.getMetadata(NAMESPACE);
        const parentName = parent.getName();
        
        const nsNodeParent = (await this.namespaceRetriever.getNameSpace(parentNamespace)).getNode(parentName);

        // Check child name exist
        const nsChild = nsNodeParent.getChilds().get(child.getName());
        if (!nsChild) {
            throw new ParseException("Name not valid: " + child.getName(), child.getLineCreation());
        }

        // Obtenemos el namespace del child
        let namespaceChildString = nsChild.getNamespace();
        if (!namespaceChildString) namespaceChildString = parentNamespace;
        child.setMetadata(NAMESPACE, namespaceChildString);

        // Buscamos namespace
        const namespaceChild = await this.namespaceRetriever.getNameSpace(namespaceChildString);
        if (!namespaceChild) {
            throw new ParseException("Not found namespace " + namespaceChildString, child.getLineCreation());
        }

        // Buscamos definición de nodo
        const childNode = namespaceChild.getNode(child.getName());
        if (!childNode) {
            throw new ParseException("Not found " + child.getName() + " in namespace " + namespaceChildString, child.getLineCreation());
        }

        // Insertamos según tipo
        child.setMultiline(NamespaceType.isMultiline(childNode.getType()));
    }

    async processAfterAdd(parent, child) {
        // No additional processing needed
    }

    async updateMainNamespace(node) {
        const split = LineSplitter.split(node.getName());
        const name = split.centralText;
        const namespace = split.suffix;
        const prefix = split.prefix;

        // Current doc raw
        this.currentDocRaw = namespace === null;
        if (this.currentDocRaw) return; // No process

        // Validate prefix
        if (prefix !== null) {
            throw new ParseException("Prefix not allowed in node name: " + prefix, node.getLineCreation());
        }

        // Get namespace
        const ns = await this.namespaceRetriever.getNameSpace(namespace);
        if (!ns) {
            throw new ParseException("Namespace unknown: " + namespace, node.getLineCreation());
        }

        // Check exist name
        const nsNode = ns.getNode(name);
        if (!nsNode) {
            throw new ParseException("Name " + name + " not found in namespace " + namespace, node.getLineCreation());
        }

        // Cambiamos nombre
        node.setName(name);
        node.setMetadata(NAMESPACE, namespace);

        // Validamos primer nodo
        await NamespaceValidator.validateValue(nsNode, node);
    }

    validateNotImplicitMultiline(node) {
        if (node.getValues() !== null) {
            for (const nl of node.getValues()) {
                if (nl.isExplicit()) {
                    throw new ParseException("No allowed explicit multilines in NS documents", nl.getLineCreation());
                }
            }
        }
    }
}

