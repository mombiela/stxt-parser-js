import { Processor } from '../js/stxt-parser.js';
import { Node } from '../js/stxt-parser.js';


export async function testProcessor() {
    let result = "";

    class TestProcessor extends Processor {
        async processNodeOnCreation(node) {
            result += `Node created: ${node.getName()}<br>`;
        }

        async processNodeOnCompletion(node) {
            result += `Node completed: ${node.getName()}<br>`;
        }

        async processBeforeAdd(parent, child) {
            result += `Before adding child: ${child.getName()} to parent: ${parent.getName()}<br>`;
        }

        async processAfterAdd(parent, child) {
            result += `After adding child: ${child.getName()} to parent: ${parent.getName()}<br>`;
        }
    }

    const processor = new TestProcessor();
    const parentNode = new Node(1, 0, "parentNode", "parentValue");
    const childNode = new Node(2, 1, "childNode", "childValue");

    await processor.processNodeOnCreation(parentNode);
    await processor.processBeforeAdd(parentNode, childNode);
    parentNode.addChild(childNode);
    await processor.processAfterAdd(parentNode, childNode);
    await processor.processNodeOnCompletion(parentNode);

    return result;
}
