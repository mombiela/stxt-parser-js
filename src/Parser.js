import { Node } from './Node.js';
import { NodeLine} from './NodeLine.js';
import { LineIndent } from './LineIndent.js';
import { ParseException } from './ParseException.js';
import { Processor } from './Processor.js';

export class Parser {
    constructor() {
        this.debug = false;
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

        for (let line of lines) {
            this.lineNumber++;
			line = line.replace(/\r/g, '');
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
        value = line.substring(i + 1);

        if (name === "")
		{
			 name = null;
		}
        else
		{
			value = value.trim();
			if (value === "") value = null;
		}
        
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

