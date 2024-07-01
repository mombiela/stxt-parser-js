import { NamespaceNode } from './NamespaceNode.js';
import { NamespaceNodeChild } from './NamespaceNodeChild.js';
import { Type } from './type.js';

export class RootGrammar {
    static generateRootGrammar() {
        const nameSpace = "www.semantictext.info/namespace.stxt";
        const result = [];

        // --------
        // Type def
        // --------

        let type = new NamespaceNode();
        type.setName("n_def");
        type.setNodeType(Type.NODE);
        type.setNamespace(nameSpace);
        type.setAlias([]);

        let childs = [
            new NamespaceNodeChild("cn", nameSpace, "1"),
            new NamespaceNodeChild("a", nameSpace, "*"),
            new NamespaceNodeChild("type", nameSpace, "1"),
            new NamespaceNodeChild("dsc", nameSpace, "?"),
            new NamespaceNodeChild("ch", nameSpace, "*")
        ];
        type.setChilds(childs);

        result.push(type);

        // -----
        // Child
        // -----

        type = new NamespaceNode();
        type.setName("ch");
        type.setNodeType(Type.NODE);
        type.setNamespace(nameSpace);
        type.setAlias([]);

        childs = [
            new NamespaceNodeChild("cn", nameSpace, "1"),
            new NamespaceNodeChild("n", nameSpace, "1"),
            new NamespaceNodeChild("ns", nameSpace, "?")
        ];
        type.setChilds(childs);

        result.push(type);

        // --------------------
        // Namespace definition
        // --------------------

        type = new NamespaceNode();
        type.setName("ns_def");
        type.setNodeType(Type.NODE);
        type.setNamespace(nameSpace);
        type.setAlias([]);

        childs = [
            new NamespaceNodeChild("n_def", nameSpace, "+")
        ];
        type.setChilds(childs);

        result.push(type);

        // -------------
        // Simple Childs
        // -------------

        this.createSimple("cn", nameSpace, result);
        this.createSimple("a", nameSpace, result);
        this.createSimple("type", nameSpace, result);
        this.createSimple("n", nameSpace, result);
        this.createSimple("dsc", nameSpace, result);
        this.createSimple("ns", nameSpace, result);

        return result;
    }

    static createSimple(name, nameSpace, result) {
        const type = new NamespaceNode();
        type.setName(name);
        type.setNodeType(Type.TEXT);
        type.setNamespace(nameSpace);
        type.setAlias([]);
        result.push(type);
    }

    static getRootGrammarContentString() {
        return `#   -------------------------------------------------------
#   Generic Grammar: 
#       This grammar uses only Canonical Names
#       to allow simple parsers and future alias addition
#   
#       For examples and description:
#       http://www.semantictext.info
#              
#   ns_def (namespace definition,namespace_definition):
#       n_def (node definition, node def, node_def):
#           cn (name, node, node name, canonical name):
#           a(al, alias):
#           type (node type):
#           dsc (descrip, description):
#           ch(child, child node):
#               cn (name, node, node name, canonical name):
#               ns (namespace):
#               n (num):
#   -------------------------------------------------------

ns_def(www.semantictext.info/namespace.stxt):
 
n_def:
    type:NODE
    cn:ns_def
    a:namespace definition
    a:namespace_definition
    ch:
        cn:n_def
        n:+
n_def:
    type:NODE
    cn:n_def
    a:node definition
    a:node def
    a:node_def
    ch:
        cn:cn
        n:1
    ch:
        cn:a
        n:*
    ch:
        cn:type
        n:1
    ch:
        cn:dsc
        n:?
    ch:
        cn:ch
        n:*
n_def:
    type:NODE
    cn:ch
    a:Child
    a:Child Node
    ch:
        cn:cn
        n:1
    ch:
        cn:ns
        n:?
    ch:
        cn:n
        n:1
n_def:
    type:TEXT
    cn:cn
    a:name
    a:node
    a:node name
    a:canonical name
n_def:
    type:TEXT
    cn:a
    a:al
    a:alias
n_def:
    type:TEXT
    cn:type
    a:node type
n_def:
    type:TEXT
    cn:n
    a:num
    a:occurs
n_def:
    type:TEXT
    cn:dsc
    a:descrip
    a:description
n_def:
    type:TEXT
    cn:ns
    a:namespace
`;
    }
}
