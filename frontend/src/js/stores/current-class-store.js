"use strict";

import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { classToJSONLD, JSONLDtoClass } from '../json-ld-adapter';
import { loadClassDetail } from '../sparql-adapter';
import * as TEMPLATES from '../templates/index';
import $ from 'jquery';
import _ from 'lodash';
import Device from '../models/device';
import { parseTriples } from '../utils';


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

        parseTriples(TEMPLATES.getDevice()).then((triples) => {
            this._device = new Device(triples);
            this._device.addSensor(TEMPLATES.getSensor()).then(() => {
                const sensors = this._device.sensors;
                sensors.forEach((s) => {
                    s.toTurtle((res) => {
                        console.log(res);
                    });
                    console.log(s.measurementProperties);
                    console.log(s.accuracy);
                    console.log(s.sensitivity);
                    console.log(s.resolution);
                });
            });
            promise.resolve();
        });

        return promise;
    }
    _loadDevie(uri) {

    }
}

export default new CurrentClassStore();
