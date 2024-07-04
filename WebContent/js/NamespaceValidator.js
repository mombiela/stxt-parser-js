import { NamespaceType } from './NamespaceType.js';
import { NamespaceNode } from './NamespaceNode.js';
import { Node } from './Node.js';
import { ParseException } from './ParseException.js';
import { cleanupString } from './Utils.js';

const P_BOOLEAN = /^(true|false)$/;
const P_HEXADECIMAL = /^#?([A-Fa-f0-9]|\s)+$/;
const P_INTEGER = /^(\-|\+)?\d+$/;
const P_NATURAL = /^\d+$/;
const P_NUMBER = /^(\-|\+)?\d+(\.\d+(e(\-|\+)?\d+)?)?$/;
const P_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_8601_PATTERN = 
    "^\\d{4}-\\d{2}-\\d{2}" +              
    "T" +                                   
    "\\d{2}:\\d{2}(:\\d{2}(\\.\\d{3})?)?" + 
    "(Z|[+-]\\d{2}:\\d{2})?$";
const P_TIMESTAMP = new RegExp(ISO_8601_PATTERN);
const EMAIL_PATTERN = 
    "^(?=.{1,256})(?=.{1,64}@.{1,255}$)(?=.{1,64}@.{1,63}\\..{1,63}$)[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
const P_EMAIL = new RegExp(EMAIL_PATTERN);

export class NamespaceValidator {
    static async validateValue(nsNode, n) {
        const nodeType = nsNode.getType();
        if (NamespaceType.BASE64 === nodeType) return this.validateBase64(n);
        if (NamespaceType.BOOLEAN === nodeType) return this.validateBoolean(n);
        if (NamespaceType.HEXADECIMAL === nodeType) return this.validateHexadecimal(n);
        if (NamespaceType.INTEGER === nodeType) return this.validateInteger(n);
        if (NamespaceType.NATURAL === nodeType) return this.validateNatural(n);
        if (NamespaceType.URL === nodeType) return this.validateUrl(n);
        if (NamespaceType.NUMBER === nodeType) return this.validateNumber(n);
        if (NamespaceType.TEXT === nodeType) return this.validateText(n);
        if (NamespaceType.STRING === nodeType) return this.validateText(n);
        if (NamespaceType.DATE === nodeType) return this.validateDate(n);
        if (NamespaceType.EMAIL === nodeType) return this.validateEmail(n);
        if (NamespaceType.EMPTY === nodeType) return this.validateEmpty(n);
        if (NamespaceType.TIMESTAMP === nodeType) return this.validateTimestamp(n);
        if (NamespaceType.ENUM === nodeType) return this.validateEnum(n, nsNode.getValues());
        if (NamespaceType.REGEX === nodeType) return this.validateRegex(n, nsNode.getValues());
        throw new ParseException("Node type not supported: " + nodeType, n.getLineCreation());
    }

    static async validateCount(nsNode, node) {
        const count = new Map();

        for (const child of node.getChilds()) {
            const childName = child.getName();
            count.set(childName, (count.get(childName) || 0) + 1);
        }

        for (const chNode of nsNode.getChilds().values()) {
            this.verifyCount(chNode, count.get(chNode.getName()) || 0, node);
        }
    }

    static verifyCount(chNode, num, node) {
        const count = chNode.getNum();
		console.log("!!!verifyCount: " + count);
        if (count == "*") return;
        else if (count == "?") {
			if (num > 1)
            	throw new ParseException(`Node '${node.getName()}' can have only 1 child of name '${chNode.getName()}' and have ${num}`, node.getLineCreation());
        }
        else if (count == "+") {
			if (num == 0)
            	throw new ParseException(`Node '${node.getName()}' should have at least 1 child of name '${chNode.getName()}'`, node.getLineCreation());
        }
        else if (count.endsWith("+")) {
            const expectedNum = parseInt(count.slice(0, -1), 10);
            if (num < expectedNum) {
                throw new ParseException(`Node '${node.getName()}' should have at least ${expectedNum} childs of name '${chNode.getName()}', and have ${num}`, node.getLineCreation());
            }
        }
        else if (count.endsWith("-")) {
            const expectedNum = parseInt(count.slice(0, -1), 10);
            if (num > expectedNum) {
                throw new ParseException(`Node '${node.getName()}' should have maximum of ${expectedNum} childs of name '${chNode.getName()}', and have ${num}`, node.getLineCreation());
            }
        } else {
            const expectedNum = parseInt(count, 10);
            if (expectedNum !== num) {
                throw new ParseException(`Node '${node.getName()}' should have ${expectedNum} of child of name '${chNode.getName()}', and have ${num}`, node.getLineCreation());
            }
        }
    }

    // ------------------------
    // Validation of simple nodes
    // ------------------------
    
    static validateBoolean(n) {
        this.validateValueWithPattern(n, P_BOOLEAN, "Invalid boolean");
    }

    static validateDate(n) {
        this.validateValueWithPattern(n, P_DATE, "Invalid date");
    }

    static validateTimestamp(n) {
        this.validateValueWithPattern(n, P_TIMESTAMP, "Invalid timestamp");
    }

    static validateEmail(n) {
        this.validateValueWithPattern(n, P_EMAIL, "Invalid email");
    }

    static validateInteger(n) {
        this.validateValueWithPattern(n, P_INTEGER, "Invalid integer");
    }

    static validateNatural(n) {
        this.validateValueWithPattern(n, P_NATURAL, "Invalid natural");
    }

    static validateNumber(n) {
        this.validateValueWithPattern(n, P_NUMBER, "Invalid number");
    }

    static validateEmpty(n) {
        if (n.getValue() !== null || (n.getValues() !== null && n.getValues().length > 0)) {
            throw new ParseException(`Node '${n.getName()}' has to be empty`, n.getLineCreation());
        }
    }
    
    static validateBase64(n) {
        try {
            atob(cleanupString(n.getText()));
        } catch (e) {
            throw new ParseException(`Node '${n.getName()}' Invalid Base64`, n.getLineCreation());
        }
    }
    
    static validateHexadecimal(n) {
        const hex = cleanupString(n.getText());
        const m = P_HEXADECIMAL.exec(hex);
        if (!m) throw new ParseException(`Node '${n.getName()}' Invalid hexadecimal`, n.getLineCreation());
    }
    
    static validateText(n) {
        // No validation, but trim trailing line breaks
    }
    
    static validateEnum(n, values) {
        if (!values.has(n.getValue())) {
            throw new ParseException(`Node '${n.getName()}' has value not allowed: ${n.getValue()}`, n.getLineCreation());
        }
    }
    
    static validateRegex(n, values) {
        for (const value of values) {
            const p = new RegExp(value);
            if (p.test(n.getValue())) return;
        }
        throw new ParseException(`Node '${n.getName()}' has value not allowed: ${n.getValue()}`, n.getLineCreation());
    }
    
    static validateUrl(n) {
        if (!this.isValidURL(n.getValue())) {
            throw new ParseException(`Invalid URL: ${n.getValue()}`, n.getLineCreation());
        }
    }

    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    static validateValueWithPattern(n, pattern, error) {
        const m = pattern.exec(n.getValue());
        if (!m) throw new ParseException(`${n.getName()}: ${error} (${n.getValue()})`, n.getLineCreation());
    }
}

export async function testNamespaceValidator() {
    let result = "";

    const nsNode = new NamespaceNode();
    nsNode.setType("STRING");

    const node = new Node(1, 0, "testNode", "testValue");

    try {
        await NamespaceValidator.validateValue(nsNode, node);
        result += `Valid STRING value<br>`;
    } catch (e) {
        result += `Error validating STRING value: ${e.message}<br>`;
    }

/*    nsNode.setType("EMAIL");
    node.setValue("invalid-email");

    try {
        await NamespaceValidator.validateValue(nsNode, node);
        result += `Valid EMAIL value<br>`;
    } catch (e) {
        result += `Error validating EMAIL value: ${e.message}<br>`;
    }
*/
    return result;
}
