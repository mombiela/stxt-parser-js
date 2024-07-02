import { Node } from './Node.js';  // Asegúrate de que esta ruta es correcta
import { ParseException } from './ParseException.js';

export class Processor {
    async processNodeOnCreation(node) {
        throw new ParseException("Method 'processNodeOnCreation' must be implemented.");
    }

    async processNodeOnCompletion(node) {
        throw new ParseException("Method 'processNodeOnCompletion' must be implemented.");
    }

    async processBeforeAdd(parent, child) {
        throw new ParseException("Method 'processBeforeAdd' must be implemented.");
    }

    async processAfterAdd(parent, child) {
        throw new ParseException("Method 'processAfterAdd' must be implemented.");
    }
}

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
