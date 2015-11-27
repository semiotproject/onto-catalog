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

        let requests = [
            loadSensorTypes(),
            loadUnitsOfMeasurement()
        ];

        $.when(...requests).done((
            sensorTypes,
            unitsOfMeasurement
        ) => {
            console.log(
                'loaded: sensor types - ', sensorTypes,
                ', units of measurement - ', unitsOfMeasurement
            );
            this._data = {
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


}

export default new FieldStore();