"use strict";

import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { classToJSONLD, JSONLDtoClass } from '../json-ld-adapter';
import { loadClassDetail } from '../sparql-adapter';
import * as TEMPLATES from '../templates/index';
import $ from 'jquery';
import _ from 'lodash';
import { Parser } from 'n3';
import Device from '../models/device';

const parser = new Parser();

function parseTriples(turtle) {
    const defer = $.Deferred();
    const triples = [];

    parser.parse(turtle, (err, triple) => {
        if (err) {
            console.error(`error while parsing triples: `, err);
            defer.reject();
        }
        if (triple) {
            triples.push(triple);
        } else {
            defer.resolve(triples);
        }
    });

    return defer;
}

class CurrentClassStore extends EventEmitter {
    constructor() {
        super();
        this._device = null;
    }
    init(uri) {
        if (!uri) {
            return this._createDevice();
        }
        return this._loadDevie(uri);
    }
    _createDevice() {
        const promise = $.Deferred();

        const turtle = TEMPLATES.getDevice();

        parseTriples(turtle).then((triples) => {
            this._device = new Device(triples);

            console.log(this._device.label, this._device.manufacturer, this._device.creator);

            this._device.label = "5";

            console.log(this._device.label, this._device.manufacturer, this._device.creator);

            promise.resolve();
        });

        return promise;
    }
    _loadDevie(uri) {

    }
}

export default new CurrentClassStore();
