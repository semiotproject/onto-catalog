"use strict";

import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { loadModelDetail } from '../sparql-adapter';
import { getDevice, getSensor } from '../templates/index';
import { parseTriples } from '../utils';
import Device from '../models/device';
import { createModel } from "../api-adapter";

class ModelDetailStore extends EventEmitter {
    constructor() {
        super();
        this._device = null;
    }
    init(uri) {
        if (!uri) {
            return this._createDevice();
        }
        return this._loadDevice(uri);
    }
    getDevice() {
        return this._device;
    }
    addSensor() {
        return this._device.addSensor(getSensor()).then(() => {
            this.emit('update');
        });
    }
    setDeviceLabel(label) {
        this._device.label = label;
        this.emit('update');
    }
    setSensorType(uri, type) {
        this._device.sensors.map((s) => {
            if (s.uri === uri) {
                s.observes = type;
                this.emit('update');
            }
        });
    }
    save() {
        this._device.toTurtle((res) => {
            console.info(`result ttl is: ${res}`);
            createModel(res);
        });
    }

    _createDevice() {
        const promise = $.Deferred();

        parseTriples(getDevice()).then((triples) => {
            this._device = new Device(triples);
            promise.resolve();
        });

        return promise;
    }
    _loadDevice(uri) {
        // TODO
    }
}

export default new ModelDetailStore();
