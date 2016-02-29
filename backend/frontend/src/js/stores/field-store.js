"use strict";

import $ from 'jquery';
import _ from 'lodash';

import { EventEmitter } from 'events';
import { loadUnitsOfMeasurement, loadSensorTypes } from '../sparql-adapter';
import CONFIG from '../config';

class FieldStore extends EventEmitter {
    constructor() {
        super();
        this._data = {
            sensorTypes: [],
            unitsOfMeasurement: []
        };
    }
    load() {
        const promise = $.Deferred();

        loadSensorTypes().done((sensorTypes) => {
            console.log('loaded: sensor types - ', sensorTypes);
            this._data = {
                sensorTypes: sensorTypes
            };
            if (sensorTypes.length > 0) {
                console.log('loading units of measurement for sensotr type ', sensorTypes[0]);
                this.loadUnitsOfMeasurement(sensorTypes[0].literal).done(() => {
                    promise.resolve(this._data);
                });
            } else {
                this._data.unitsOfMeasurement = [];
                promise.resolve(this._data);
            }
        });

        return promise;
    }

    loadUnitsOfMeasurement(sensorTypeURI) {
        const promise = $.Deferred();

        loadUnitsOfMeasurement(sensorTypeURI).done((unitsOfMeasurement) => {
            console.log('loaded units of measurement - ', unitsOfMeasurement);
            this._data.unitsOfMeasurement = unitsOfMeasurement;
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


}

export default new FieldStore();