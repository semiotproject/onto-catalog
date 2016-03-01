"use strict";

import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { loadModelDetail } from '../sparql-adapter';
import { getModel, getSensor, getMeasurementProperty } from '../templates/index';
import { parseTriples } from '../utils';
// import Model from '../models/model';
import { fromTurtle, toTurtle } from '../turtle-adapter';
import { createModel, updateModel } from "../api-adapter";

class ModelDetailStore extends EventEmitter {
    constructor() {
        super();
    }
    init(uri) {
        if (!uri) {
            return this._createModel();
        }
        return this._loadModel(uri);
    }
    _createModel() {
        this._model = {
            uri: 'uri',
            label: 'label',
            manufacturer: 'manufacturer',
            sensors: []
        };
    }
    _loadModel(uri) {
        const promise = $.Deferred();

        loadModelDetail(uri).then((ttl) => {
            fromTurtle(ttl).then((model) => {
                this._model = model;
            });
        });

        return promise;
    }
    getModel() {
        return this._model;
    }
    addSensor() {
        this._model.sensors.push({
            uri: 'todo',
            label: 'new sensor',
            featureOfInterest: ''
        });
        this.triggerUpdate();
    }
    triggerUpdate() {
        this.emit('update');
    }
    /*

    get MEASUREMENT_PROPERTIES() {
        return [
            'Drift',
            'Sensitivity',
            'Selectivity',
            'Accuracy',
            'MeasurementRange',
            'DetectionLimit',
            'Precision',
            'Frequency',
            'ResponseTime',
            'Latency',
            'Resolution'
        ].map((p) => { return `ssn:${p}`; });
    }

    constructor() {
        super();
        this._model = null;
    }
    init(uri) {
        if (!uri) {
            return this._createModel();
        }
        return this._loadModel(uri);
    }
    getModel() {
        return this._model;
    }
    addSensor() {
        return this._model.addSensor(getSensor(this._model.uri)).then(() => {
            this.emit('update');
        });
    }
    addSensorProperty(sensorURI, propType) {
        console.info(`adding prop ${propType} to ${sensorURI}`);
        return this._model.addSensor(getMeasurementProperty(sensorURI, propType)).then(() => {
            this.emit('update');
        });
    }
    setModelLabel(label) {
        this._model.label = label;
        this.emit('update');
    }
    setSensorType(uri, type) {
        this._model.setSensorObserves(uri, type);
        this.emit('update');
    }
    save() {
        this._model.toTurtle((res) => {
            console.info(`result ttl is: ${res}`);
            createModel(res);
        });
    }
    update(uri) {
        this._model.toTurtle((res) => {
            console.info(`result ttl is: ${res}`);
            updateModel(uri, res);
        });
    }
    triggerUpdate() {
        this.emit('update');
    }

    _createModel() {
        const promise = $.Deferred();

        parseTriples(getModel()).then((triples) => {
            this._model = new Model(triples);
            promise.resolve();
        });

        return promise;
    }
    _loadModel(uri) {
        const promise = $.Deferred();

        loadModelDetail(uri).then((ttl) => {
            parseTriples(ttl).then((triples) => {
                this._model = new Model(triples);
                promise.resolve();
            });
        });

        return promise;
    }
    */
}

export default new ModelDetailStore();
