"use strict";

import { EventEmitter } from 'events';

class DescriptionStore extends EventEmitter {
    constructor() {
        super();
    }
    load() {
        this.emit('load');
    }
    save() {
        
    }
    remove() {
        
    }
}

export default new DescriptionStore();
