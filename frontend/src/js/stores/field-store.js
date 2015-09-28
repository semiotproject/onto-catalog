"use strict";

import $ from 'jquery';
import _ from 'lodash';

import { EventEmitter } from 'events';
import { loadMeasurementProperties, loadUnitsOfMeasurement, loadSensorTypes } from '../sparql-adapter';
import CONFIG from '../config';

class FieldStore extends EventEmitter {
    constructor() {
        super();
        this._data = {
            measurementProperties: [],
            sensorTypes: [],
            unitsOfMeasurement: []
        };
    }
    load() {
        const promise = $.Deferred();

        let requests = [
            loadMeasurementProperties(),
            loadSensorTypes(),
            loadUnitsOfMeasurement()
        ];

        $.when(...requests).done((
            measurementProperties,
            sensorTypes,
            unitsOfMeasurement
        ) => {
            console.log(
                'loaded: sensor types - ', sensorTypes,
                ', measurement properties - ', measurementProperties,
                ', units of measurement - ', unitsOfMeasurement
            );
            this._data = {
                measurementProperties: measurementProperties,
                sensorTypes: sensorTypes,
                unitsOfMeasurement: unitsOfMeasurement
            };
            promise.resolve(this._data);
        });

        return promise;
    }

    getUnitsOfMeasurement() {
        return this._data.unitsOfMeasurement;
    }
    getSensorTypes() {
        return this._data.sensorTypes;
    }
    getMeasurementProperties() {
        return this._data.measurementProperties;
    }


}

export default new FieldStore();