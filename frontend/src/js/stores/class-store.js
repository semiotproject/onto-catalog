"use strict";

import { EventEmitter } from 'events';
import $ from 'jquery';
import _ from 'lodash';

class ClassStore extends EventEmitter {
    constructor() {
        super();
    }
    load() {
        // TODO: remove this mock
        const promise = $.Deferred();

        this._data = _.range(5).map((i) => {
            return {
                uri: "my awesome uri " + i
            };
        });
        promise.resolve(this._data);

        return promise;
    }
    getByURI(uri) {
        return _.find(this._data, (c) => {
            return c.uri === uri;
        });
    }
    get() {
        return this._data;
    }
    create(json) {
        //
    }
    update(json) {

    }
    delete(uri) {

    }

    getDescription() {
        return this._data.description;
    }
    setDescription(d) {
        this._data.description = d;
        this.emit('update');
    }

    getActuators() {
        return this._data.actuators;
    }
    getActuatorById(aid) {
        return _.find(this._data.actuators, (a) => {
            return a.id === aid;
        });
    }

    getSensors() {
        return this._data.sensors;
    }
    getSensorById(sid) {
        return _.find(this._data.sensors, (s) => {
            return s.id === sid;
        });
    }
    addSensor(sensor) {
        sensor.id = this._data.sensors.length;
        this._data.sensors.push(sensor);
        this.emit('update');
    }
    saveSensor(sensor) {
        this._data.sensors.forEach((s, index) => {
            if (s.id == sensor.id) {
                this._data.sensors[index] = sensor;
                this.emit('update');
            }
        });
    }
}

export default new ClassStore();
