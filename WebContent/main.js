import { getUrlContent } from './js/utilsURL.js';
import { uniform } from './js/utilsName.js';
import { cleanupString } from './js/utilsCleanup.js';
import { Type } from './js/type.js';
import { Constants } from './js/constants.js';
import { NamespaceNodeChild } from './js/NamespaceNodeChild.js';
import { NamespaceNode } from './js/NamespaceNode.js';

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
const node = new NamespaceNode('name', 'namespace', ['alias1', 'alias2'], Type.NODE, [nodeChild]);
console.log(node.toString());  // Salida: "NamespaceNode [name=name, namespace=namespace, nodeType=NODE, alias=["alias1","alias2"], childs=[NamespaceNodeChild [type=TYPE, namespace=NAMESPACE, num=NUM]]]"




