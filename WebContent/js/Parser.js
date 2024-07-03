import { Node } from './Node.js';
import { NodeLine} from './NodeLine.js';
import { LineIndent } from './LineIndent.js';
import { ParseException } from './ParseException.js';
import { Processor } from './Processor.js';

export class Parser {
    constructor() {
        this.debug = true;
        this.nodeProcessors = [];
        this.document = null;
        this.stack = [];
        this.currentRoot = null;
        this.lineNumber = 0;
        this.currentLevel = 0;
    }

    addNodeProcessor(processor) {
        this.nodeProcessors.push(processor);
    }

    async parse(content) {
        this.document = [];
        this.stack = [];
        this.currentRoot = null;
        this.lineNumber = 0;
        this.currentLevel = 0;
        
        content = LineIndent.removeUTF8BOM(content);
        const lines = content.split('\n');

        for (const line of lines) {
            this.lineNumber++;
            await this.processLine(line);
        }

        if (this.currentRoot !== null) {
            await this.processCompletion(this.currentRoot);
            this.document.push(this.currentRoot);
        }
        
        return this.document;
    }

    async processLine(line) {
        const lastNode = this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
        const lastNodeMultiline = lastNode !== null && lastNode.isMultiline();

        const lineIndent = LineIndent.parseLine(line, lastNodeMultiline, this.stack.length, this.lineNumber);
        if (lineIndent === null) return; // is a comment
        this.showLine(line, lineIndent);
        
        if (lastNodeMultiline && lineIndent.indentLevel >= this.stack.length) {
            this.addMultilineValue(lastNode, lineIndent.lineWithoutIndent, false);
            return;
        }

        if (lineIndent.indentLevel > this.currentLevel + 1) 
            throw new ParseException("Level of indent incorrect: " + lineIndent.indentLevel, this.lineNumber);
        
        this.currentLevel = lineIndent.indentLevel;
        const node = await this.createNode(lineIndent);

        if (node.getName() === null && lastNode !== null) {
            this.addMultilineValue(lastNode, node.getValue(), true);
            return;
        }
        
        await this.processCreation(node);

        if (this.currentLevel === 0) {
            if (this.currentRoot !== null) {
                await this.processCompletion(this.currentRoot);
                this.document.push(this.currentRoot);
            }
            this.currentRoot = node;
            this.stack = [];
            this.stack.push(this.currentRoot);
        } else {
            while (this.stack.length > this.currentLevel) {
                const finishedNode = this.stack.pop();
                await this.processCompletion(finishedNode);
            }

            const peek = this.stack[this.stack.length - 1];
            await this.processBeforeAddNode(peek, node);
            peek.addChild(node);
            await this.processAfterAddNode(peek, node);
            this.stack.push(node);
        }
        
        this.showCurrentRoot();
    }

    addMultilineValue(lastNode, value, explicit) {
        lastNode.addLine(new NodeLine(this.lineNumber, this.currentLevel, value, explicit));
        this.showCurrentRoot();
    }

    async createNode(result) {
        const line = result.lineWithoutIndent;
        let name = line;
        let value = null;
        
        const i = line.indexOf(':');
        if (i === -1) throw new ParseException("Line not valid: " + line, this.lineNumber);

        name = line.substring(0, i).trim();
        value = line.substring(i + 1).trim();

        if (name === "") name = null;
        else if (value === "") value = null;
        
        return new Node(this.lineNumber, this.currentLevel, name === null ? name : name.toLowerCase(), value);
    }

    async processCreation(node) {
        for (const processor of this.nodeProcessors) {
            await processor.processNodeOnCreation(node);
        }
    }

    async processCompletion(node) {
        for (const processor of this.nodeProcessors) {
            await processor.processNodeOnCompletion(node);
        }
    }

    async processBeforeAddNode(parent, child) {
        for (const processor of this.nodeProcessors) {
            await processor.processBeforeAdd(parent, child);
        }
    }

    async processAfterAddNode(parent, child) {
        for (const processor of this.nodeProcessors) {
            await processor.processAfterAdd(parent, child);
        }
    }

    showCurrentRoot() {
        if (this.debug) console.log("\n" + this.currentRoot);
    }

    showLine(line, result) {
        if (this.debug) {
            console.log("***********************************************************************************");
            console.log("Line: '" + line + "'");
            console.log("Line " + this.lineNumber + ": " + result);
        }
    }
}

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
