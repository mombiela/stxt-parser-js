var MyBundle = (function (exports) {
  'use strict';

  class Constants {
    static COMMENT_CHAR = '#';
    static TAB_SPACES = 4;
    static TAB = '\t';
    static SPACE = ' ';
    static SEP_NODE = ':';
    static ENCODING = 'UTF-8';
    static NAMESPACE = 'Namespace';
  }

  class ParseException extends Error {
      constructor(message, line) {
          super(`Line ${line}: ${message}`);
          this.line = line;
          this.name = "ParseException";
      }
  }

  const EMPTY_LINE = /^\s*$/;
  const COMMENT_LINE = /^\s*#.*$/;

  class LineIndent {
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
              if (charPointer === Constants.SPACE) {
                  spaces++;
                  if (spaces === Constants.TAB_SPACES) {
                      level++;
                      spaces = 0;
                  }
              } else if (charPointer === Constants.TAB) {
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

  class LineSplitter {
      constructor(prefix, centralText, suffix) {
          this.prefix = prefix;
          this.centralText = centralText;
          this.suffix = suffix;
      }

      getPrefix() {
          return this.prefix;
      }

      getCentralText() {
          return this.centralText;
      }

      getSuffix() {
          return this.suffix;
      }

      static split(input) {
          let prefix, centralText, suffix;
          
          const pattern = /(\(([^)]*)\))?(.*?)(\(([^)]*)\))?$/;
          const matcher = input.match(pattern);
          
          if (matcher) {
              prefix = matcher[2] ? matcher[2].trim() : null;
              centralText = matcher[3] ? matcher[3].trim() : null;
              suffix = matcher[5] ? matcher[5].trim() : null;
          } else {
              centralText = input.trim();
              prefix = null;
              suffix = null;
          }
          if (centralText && centralText.length === 0) centralText = null;
          
          return new LineSplitter(prefix, centralText, suffix);
      }
  }

  const NamespaceType = {
      TEXT: "TEXT",
      STRING: "STRING",
      NUMBER: "NUMBER",
      BOOLEAN: "BOOLEAN",
      REGEX: "REGEX",
      ENUM: "ENUM",
      DATE: "DATE",
      TIMESTAMP: "TIMESTAMP",
      EMAIL: "EMAIL",
      URL: "URL",
      HEXADECIMAL: "HEXADECIMAL",
      BASE64: "BASE64",
      EMPTY: "EMPTY",
      INTEGER: "INTEGER",
      NATURAL: "NATURAL",
  	"getDefault": getDefault,
  	"isValidType": isValidType,
  	"isMultiline": isMultiline,
  	"isValuesType": isValuesType,
  	"isValidNamespace": isValidNamespace,
  	"isValidCount": isValidCount
  };

  const MULTILINE_TYPES = new Set([NamespaceType.TEXT, NamespaceType.BASE64, NamespaceType.HEXADECIMAL]);
  const SINGLELINE_TYPES = new Set([
      NamespaceType.STRING, NamespaceType.NUMBER, NamespaceType.BOOLEAN, NamespaceType.REGEX, NamespaceType.ENUM,
      NamespaceType.DATE, NamespaceType.TIMESTAMP, NamespaceType.EMAIL, NamespaceType.URL, NamespaceType.EMPTY,
      NamespaceType.INTEGER, NamespaceType.NATURAL
  ]);
  const ALL_TYPES = new Set([...SINGLELINE_TYPES, ...MULTILINE_TYPES]);
  const VALUES_TYPES = new Set([NamespaceType.ENUM, NamespaceType.REGEX]);
  const ALLOWED_COUNT = new Set(["*", "+", "?"]);

  const COUNT = /^\d+(\+|-)?$/;

  function getDefault() {
      return NamespaceType.STRING;
  }

  function isValidType(type) {
      return ALL_TYPES.has(type);
  }

  function isMultiline(type) {
      return MULTILINE_TYPES.has(type);
  }

  function isValuesType(type) {
      return VALUES_TYPES.has(type);
  }

  function isValidNamespace(namespace) {
      try {
          if (!namespace.endsWith(".stxt")) return false;
          new URL("https://" + namespace);
          return true;
      } catch (e) {
          return false;
      }
  }

  function isValidCount(num) {
      return ALLOWED_COUNT.has(num) || validateValue(COUNT, num);
  }

  function validateValue(pattern, value) {
      return pattern.test(value);
  }

  class NodeLine {
      constructor(line, level, value, explicit) {
          this.lineCreation = line;
          this.levelCreation = level;
          this.value = value;
          this.explicit = explicit;
      }

      getValue() {
          return this.value;
      }

      getLineCreation() {
          return this.lineCreation;
      }

      getLevelCreation() {
          return this.levelCreation;
      }

      isExplicit() {
          return this.explicit;
      }

      isImplicit() {
          return !this.explicit;
      }

      toString() {
          return `NodeValue [value=${this.value}, line=${this.lineCreation}, ${this.explicit ? 'explicit' : 'implicit'}]`;
      }
  }

  class Node {
      constructor(line, level, name, value) {
          this.levelCreation = level;
          this.lineCreation = line;
          this.name = name;
          this.value = value;
          this.lines = [];
          this.childs = [];
          this.metadata = {};
          this.multiline = false;
      }

      setMultiline(multiline) {
          this.multiline = multiline;
      }

      isMultiline() {
          return this.multiline;
      }

      getValue() {
          return this.value;
      }

      getMetadata(key) {
          return this.metadata[key];
      }

      setMetadata(key, value) {
          this.metadata[key] = value;
      }

      getChilds() {
          return this.childs;
      }

      addChild(child) {
          this.childs.push(child);
      }

      getName() {
          return this.name;
      }

      setName(name) {
          this.name = name;
      }

      getLineCreation() {
          return this.lineCreation;
      }

      addLine(value) {
          this.lines.push(value);
      }

      getValues() {
          return this.lines;
      }

      getText() {
          let result = "";

          if (this.value) {
              result += this.value + "\n";
          }
          for (const value of this.lines) {
              result += value.getValue() + "\n";
          }

          return result.replace(/(\s*\r?\n)+$/, "");
      }

      getChildsByName(cname) {
          return this.childs.filter(child => child.getName() === cname);
      }

      getChild(cname) {
          const result = this.getChildsByName(cname);
          if (result.length > 1) throw new Error("More than 1 child. Use getChilds");
          if (result.length === 0) return null;
          return result[0];
      }

      getChildValue(cname) {
          const result = this.getChildsByName(cname);
          if (result.length > 1) throw new Error("More than 1 child. Use getChilds");
          if (result.length === 0) return null;
          return result[0].getValue();
      }

      toString(level = 0) {
          let result = "";

          for (let i = 0; i < level; i++) result += "    ";
          result += `<${this.name}> (line:${this.lineCreation}) ${JSON.stringify(this.metadata)}: '${this.getValueShort()}', lines = ${this.lines}`;
          result += "\n";

          if (this.childs && this.childs.length > 0) {
              for (const child of this.childs) {
                  result += child.toString(level + 1);
                  result += "\n";
              }
          }

          return result.replace(/\n\n/g, "\n");
      }

      getValueShort() {
          if (this.value == null) return "<NULL>";
          return this.value;
      }

      getLevelCreation() {
          return this.levelCreation;
      }
  }

  class Parser {
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

  function cleanupString(input) {
      return input.replace(/[\r\n\t]+|\s+/g, '');
  }

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

  class NamespaceValidator {
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

  const NAMESPACE = "namespace";

  class STXTProcessor {
      constructor(namespaceRetriever) {
          this.namespaceRetriever = namespaceRetriever;
          this.currentDocRaw = false;
      }

      async processNodeOnCreation(node) {
          if (node.getLevelCreation() === 0) {
              await this.updateMainNamespace(node);
          }
      }

      async processNodeOnCompletion(node) {
          if (this.currentDocRaw) return; // No process

          const namespace = node.getMetadata(NAMESPACE);
          const nsNode = (await this.namespaceRetriever.getNameSpace(namespace)).getNode(node.getName());

          await NamespaceValidator.validateCount(nsNode, node);

          // Validamos nodo
          await NamespaceValidator.validateValue(nsNode, node);

          // Validamos no implicit multiline
          this.validateNotImplicitMultiline(node);
      }

      async processBeforeAdd(parent, child) {
          if (this.currentDocRaw) return; // No process

          // Get namespace parent
          const parentNamespace = parent.getMetadata(NAMESPACE);
          const parentName = parent.getName();
          
          const nsNodeParent = (await this.namespaceRetriever.getNameSpace(parentNamespace)).getNode(parentName);

          // Check child name exist
          const nsChild = nsNodeParent.getChilds().get(child.getName());
          if (!nsChild) {
              throw new ParseException("Name not valid: " + child.getName(), child.getLineCreation());
          }

          // Obtenemos el namespace del child
          let namespaceChildString = nsChild.getNamespace();
          if (!namespaceChildString) namespaceChildString = parentNamespace;
          child.setMetadata(NAMESPACE, namespaceChildString);

          // Buscamos namespace
          const namespaceChild = await this.namespaceRetriever.getNameSpace(namespaceChildString);
          if (!namespaceChild) {
              throw new ParseException("Not found namespace " + namespaceChildString, child.getLineCreation());
          }

          // Buscamos definici�n de nodo
          const childNode = namespaceChild.getNode(child.getName());
          if (!childNode) {
              throw new ParseException("Not found " + child.getName() + " in namespace " + namespaceChildString, child.getLineCreation());
          }

          // Insertamos seg�n tipo
          child.setMultiline(NamespaceType.isMultiline(childNode.getType()));
      }

      async processAfterAdd(parent, child) {
          // No additional processing needed
      }

      async updateMainNamespace(node) {
          const split = LineSplitter.split(node.getName());
          const name = split.centralText;
          const namespace = split.suffix;
          const prefix = split.prefix;

          // Current doc raw
          this.currentDocRaw = namespace === null;
          if (this.currentDocRaw) return; // No process

          // Validate prefix
          if (prefix !== null) {
              throw new ParseException("Prefix not allowed in node name: " + prefix, node.getLineCreation());
          }

          // Get namespace
          const ns = await this.namespaceRetriever.getNameSpace(namespace);
          if (!ns) {
              throw new ParseException("Namespace unknown: " + namespace, node.getLineCreation());
          }

          // Check exist name
          const nsNode = ns.getNode(name);
          if (!nsNode) {
              throw new ParseException("Name " + name + " not found in namespace " + namespace, node.getLineCreation());
          }

          // Cambiamos nombre
          node.setName(name);
          node.setMetadata(NAMESPACE, namespace);

          // Validamos primer nodo
          await NamespaceValidator.validateValue(nsNode, node);
      }

      validateNotImplicitMultiline(node) {
          if (node.getValues() !== null) {
              for (const nl of node.getValues()) {
                  if (nl.isExplicit()) {
                      throw new ParseException("No allowed explicit multilines in NS documents", nl.getLineCreation());
                  }
              }
          }
      }
  }

  class STXTParser extends Parser {
      constructor(namespaceRetriever) {
          super();
          this.addNodeProcessor(new STXTProcessor(namespaceRetriever));
      }
  }

  exports.STXTParser = STXTParser;

  return exports;

})({});
