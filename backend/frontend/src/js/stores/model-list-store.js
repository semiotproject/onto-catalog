"use strict";

import { EventEmitter } from 'events';
import { loadModelList } from '../sparql-adapter';
import _ from 'lodash';

class ModelListStore extends EventEmitter {
    constructor() {
        super();
        this._data = [];
    }
    load() {
        // TODO: remove this mock
        return loadModelList().done((res) => {
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

export default new ModelListStore();
