"use strict";

import { EventEmitter } from 'events';
import $ from 'jquery';
import _ from 'lodash';

class ClassStore extends EventEmitter {
    constructor() {
        super();
    }
    get() {
        return this._data;
    }
    load() {
        // TODO: remove this mock
        const promise = $.Deferred();

        this._data = _.range(4).map((i) => {
            return {
                uri: "my awesome uri " + i
            };
        });
        promise.resolve(this._data);

        return promise;
    }
}

export default new ClassStore();
