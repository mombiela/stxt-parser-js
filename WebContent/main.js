import { getUrlContent } from './js/utilsURL.js';
import { uniform } from './js/utilsName.js';
import { cleanupString } from './js/utilsCleanup.js';
import { Type } from './js/type.js';
import { Constants } from './js/constants.js';
import { NamespaceNodeChild } from './js/NamespaceNodeChild.js';
import { NamespaceNode } from './js/NamespaceNode.js';
import { Node } from './js/Node.js';
import { ParseException } from './js/ParseException.js';
import { RootGrammar } from './js/RootGrammar.js';

getUrlContent('https://semantictext.info/es/chapter_02.stxt')
    .then(insertContent).catch(errorContent);

function insertContent(contenido)
{
	document.getElementById('content').innerText = contenido;
}

function errorContent(error)
{
	document.getElementById('content').innerText = "ERROR:\n" + error;
}

// Ejemplo de uso de uniform
const name = " Example Name ";
const uniformName = uniform(name);
console.log(uniformName);  // Salida: "example name"

// Ejemplo de uso de cleanupString
const messyString = "This\tis\na\r\nmessy string with  spaces.";
const cleanedString = cleanupString(messyString);
console.log(cleanedString);  // Salida: "Thisisamessystringwithspaces."

// Ejemplo de uso de Type
console.log(Type.NODE);  // Salida: "NODE"
console.log(Type.URL);   // Salida: "URL"

// Ejemplo de uso de Constants
console.log(Constants.COMMENT_CHAR);    // Salida: '#'
console.log(Constants.TAB_SPACES);      // Salida: 4
console.log(Constants.ENCODING);        // Salida: "UTF-8"
console.log(Constants.ROOT_NAMESPACE);  // Salida: "www.semantictext.info/namespace.stxt"

// Ejemplo de uso de NamespaceNodeChild
const nodeChild = new NamespaceNodeChild('TYPE', 'NAMESPACE', 'NUM');
console.log(nodeChild.toString());  // Salida: "NamespaceNodeChild [type=TYPE, namespace=NAMESPACE, num=NUM]"
nodeChild.setType('NEW_TYPE');
console.log(nodeChild.getType());   // Salida: "NEW_TYPE"

// Ejemplo de uso de NamespaceNode
const namespaceNode = new NamespaceNode('name', 'namespace', ['alias1', 'alias2'], Type.NODE, [nodeChild]);
console.log(namespaceNode.toString());  // Salida: "NamespaceNode [name=name, namespace=namespace, nodeType=NODE, alias=["alias1","alias2"], childs=[NamespaceNodeChild [type=TYPE, namespace=NAMESPACE, num=NUM]]]"

// Ejemplo de uso de Node
// Ejemplo de uso de Node
const childNode1 = new Node();
childNode1.setName('ChildNode1');
childNode1.setCanonicalName('CanonicalChildNode1');
childNode1.setNamespace('Namespace1');
childNode1.setType(Type.NODE);
childNode1.setValue('Child value 1');
childNode1.setLineCreation(1);

const childNode2 = new Node();
childNode2.setName('ChildNode2');
childNode2.setCanonicalName('CanonicalChildNode2');
childNode2.setNamespace('Namespace2');
childNode2.setType(Type.NODE);
childNode2.setValue('Child value 2');
childNode2.setLineCreation(2);

const parentNode = new Node();
parentNode.setName('ParentNode');
parentNode.setCanonicalName('CanonicalParentNode');
parentNode.setNamespace('ParentNamespace');
parentNode.setType(Type.NODE);
parentNode.setValue('Parent value');
parentNode.setChilds([childNode1, childNode2]);
parentNode.setLineCreation(123);

console.log(parentNode.toString());
console.log(parentNode.toSTXT());
console.log(parentNode.toSTXTCompact());

// Ejemplo de uso de ParseException
try {
    throw new ParseException('This is a parse exception', new Error('Cause of the exception'));
} catch (e) {
    console.error(e.toString());  // Salida: "ParseException: This is a parse exception"
    if (e.cause) {
        console.error('Caused by:', e.cause.toString());  // Salida: "Caused by: Error: Cause of the exception"
    }
}

// Ejemplo de uso de RootGrammar
const rootGrammar = RootGrammar.generateRootGrammar();
console.log(rootGrammar);

const rootGrammarContent = RootGrammar.getRootGrammarContentString();
console.log(rootGrammarContent);

