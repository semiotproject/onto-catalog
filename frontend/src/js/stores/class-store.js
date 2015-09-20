"use strict";

import { EventEmitter } from 'events';
import CONFIG from '../config';
import $ from 'jquery';
import _ from 'lodash';
import uuid from 'uuid';

class ClassStore extends EventEmitter {
    constructor() {
        super();
        this._counter = 0;
    }
    load() {
        // TODO: remove this mock
        const promise = $.Deferred();

        this._data = _.range(5).map((i) => {
            return {
                uri: "my awesome uri " + i,
                id: this._counter++,
                sensors: [],
                actuators: []
            };
        });
        promise.resolve(this._data);

        return promise;
    }
    generate() {
        _.remove(this._data, (c) => {
            return c.isNew;
        });
        let newClass = {
            uri: uuid.v4(),
            id: this._counter++,
            sensors: [],
            actuators: [],
            isNew: true
        };
        this._data.push(newClass);
        this.emit('update');
        return newClass.id;
    }
    getById(id) {
        return _.find(this._data, (c) => {
            return c.id === id;
        });
    }
    get() {
        return this._data;
    }
    create(json) {
        //
    }
    // local
    update(json) {
        this._data.forEach((c, index) => {
            if (c.id === json.id) {
                this._data[index] = json;
                this.emit('update');
            }
        });
    }
    // remote
    save(classId) {
        let model = this.getById(classId);
        if (!model) {
            return;
        }
        return $.ajax({
            url: CONFIG.URLS.class + (model.isNew ? "" : encodeURIComponent(model.uri)),
            type: model.isNew ? "POST" : "PUT",
            data: JSON.stringify(model),
            contentType: "applcation/ls+json",
            success() {
                model.isNew = false;
                this.emit('update');
            },
            error() {

            }
        });
    }
    remove(classId) {
        let model = this.getById(classId);
        if (!model) {
            return;
        }
        return $.ajax({
            url: CONFIG.URLS.class + (model.isNew ? "" : encodeURIComponent(model.uri)),
            type: "DELETE",
            success: () => {
                _.remove((this._data, (m) => {
                    return m.id === classId;
                }));
                this.emit('update');
            },
            error() {

            }
        });
    }

    addSensor(classId) {
        let model = _.find(this._data, (c) => {
            return c.id === classId;
        });
        if (!model) {
            return;
        }
        let newSensor = {
            id: model.sensors.length + 1,
            type: "Amperage"
        };
        model.sensors.push(newSensor);
        this.emit('update');
        return newSensor.id;
    }
    updateSensor(classId, sensor) {
        let model = _.find(this._data, (c) => {
            return c.id === classId;
        });
        if (!model) {
            return;
        }
        model.sensors.forEach((s, index) => {
            if (s.id === sensor.id) {
                model.sensors[index] = sensor;
                this.emit('update');
            }
        });
    }
    getSensorById(classId, sensorId) {
        let model = _.find(this._data, (c) => {
            return c.id === classId;
        });
        if (!model) {
            return;
        }
        return _.find(model.sensors, (s) => {
            return s.id === sensorId;
        });
    }
}

export default new ClassStore();
