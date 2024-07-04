import { Constants } from './Constants.js';
import { ParseException } from './ParseException.js';

const EMPTY_LINE = /^\s*$/;
const COMMENT_LINE = /^\s*#.*$/;

export class LineIndent {
    static UTF8_BOM = "\uFEFF";

    constructor(level, line) {
        this.indentLevel = level;
        this.lineWithoutIndent = line;
    }
    toString() {
		return "[" + this.indentLevel + "]: " + this.lineWithoutIndent;
	}

    static parseLine(aLine, lastNodeMultiline, stackSize, numLine) {
        // Validate if empty line or comment
        if (!lastNodeMultiline) {
            if (EMPTY_LINE.test(aLine) || COMMENT_LINE.test(aLine)) {
                return null;
            }
        }

        // Obtain the level and pointer
        let level = 0;
        let spaces = 0;
        let pointer = 0;

        while (pointer < aLine.length) {
            // Last char
            let charPointer = aLine.charAt(pointer);

            // Update level
            if (charPointer == Constants.SPACE) {
                spaces++;
                if (spaces == Constants.TAB_SPACES) {
                    level++;
                    spaces = 0;
                }
            } else if (charPointer == Constants.TAB) {
                level++;
                spaces = 0;
            } else {
                break;
            }

            // Pointer position
            pointer++;

            // Validate that text can only have one more level, so no information is lost
            if (lastNodeMultiline && level >= stackSize) break;
        }

        if (spaces !== 0) throw new ParseException("Invalid number spaces", numLine);

        // In case of text, check if it's a comment or not to preserve empty line (depends on the comment's level)
        if (lastNodeMultiline && level < stackSize) {
            if (EMPTY_LINE.test(aLine)) return new LineIndent(stackSize, ""); // Preserve empty line
            if (COMMENT_LINE.test(aLine)) return null; // It's a comment
        }

        return new LineIndent(level, aLine.substring(pointer));
    }

    static removeUTF8BOM(s) {
        if (s.startsWith(LineIndent.UTF8_BOM)) s = s.substring(1);
        return s;
    }
}

