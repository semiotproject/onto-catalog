import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { loadModelDetail } from '../sparql-adapter';
import { fromTurtle, toTurtle } from '../turtle/converters';
import { createModel, updateModel } from "../api-adapter";
import FieldStore from './field-store';
import uuid from 'uuid';

class ModelDetailStore extends EventEmitter {

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
        ].map((p) => {
            return {
                label: p,
                type: `ssn:${p}`
            };
        });
    }

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
        const promise = $.Deferred();
        promise.resolve();
        this._model = {
            uri: 'uri',
            label: 'label',
            manufacturer: 'manufacturer',
            sensors: []
        };
        return promise;
    }
    _loadModel(uri) {
        const promise = $.Deferred();

        loadModelDetail(uri).then((ttl) => {
            fromTurtle(ttl).then((model) => {
                this._model = model;
                promise.resolve();
            });
        });

        return promise;
    }
    getModel() {
        return this._model;
    }
    addSensor() {
        const newSensorURI = uuid.v4();

        this._model.sensors.push({
            uri: newSensorURI,
            label: 'New sensor',
            featureOfInterest: this.getDeafultFeatureOfInterest(),
            getUnitsOfMeasurement: this.getDefaultUnitsOfMeasurement(),
            props: []
        });
        this.triggerUpdate();

        return newSensorURI;
    }
    getDeafultFeatureOfInterest() {
        let featureOfInterest;
        const sensorTypes = FieldStore.getSensorTypes();
        if (sensorTypes.length === 0) {
            throw new Error('no sensor types found; possible SPARQL endpoint error');
        } else {
            featureOfInterest = sensorTypes[0].literal;
        }
        return featureOfInterest;
    }
    getDefaultUnitsOfMeasurement() {
        let defaultUnits;
        const units = FieldStore.getUnitsOfMeasurement();
        if (units.length > 0) {
            defaultUnits = units[0].literal;
        }
        return defaultUnits;
    }

    triggerUpdate() {
        console.info('current model is ', this._model, '; triggering update');
        this.emit('update');
    }

    save() {
        const ttl = toTurtle(this._model);
        console.log(`creating new model: ${ttl}`);
        createModel(ttl);
    }
}

export default new ModelDetailStore();
