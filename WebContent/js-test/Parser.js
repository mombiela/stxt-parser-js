import { Parser,Processor } from '../js/stxt-parser.js';

export async function testParser() {
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

    const parser = new Parser();
    const processor = new TestProcessor();
    parser.addNodeProcessor(processor);

    const content = `
root: Root Node
    child1: Child Node 1
        subchild1: Subchild Node 1
    child2: Child Node 2
`;

    const document = await parser.parse(content);
    result += `Parsed document: ${JSON.stringify(document)}<br>`;
	result += document[0].toString();

    return result;
}
