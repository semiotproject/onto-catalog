"use strict";

import { EventEmitter } from 'events';
import _ from 'lodash';
import { loadClassList } from '../sparql-adapter';

class ClassStore extends EventEmitter {
    constructor() {
        super();
        this._data = [];
    }
    load() {
        // TODO: remove this mock
        return loadClassList().done((res) => {
            this._data = res.results.bindings.map((b) => {
                return {
                    uri: b.uri.value,
                    label: b.label.value,
                    author: b.author.value
                };
            });
        });
    }
    getByURI(uri) {
        return _.find(this._data, (c) => {
            return c.uri === uri;
        });
    }
    get() {
        return this._data;
    }
}

export default new ClassStore();
