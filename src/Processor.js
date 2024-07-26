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

