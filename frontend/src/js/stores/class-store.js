"use strict";

import { EventEmitter } from 'events';
import CONFIG from '../config';
import $ from 'jquery';
import _ from 'lodash';
import uuid from 'uuid';
import { classToJSONLD, JSONLDtoClass } from '../json-ld-adapter';

class ClassStore extends EventEmitter {
    constructor() {
        super();
        this._counter = 0;
    }
    loadList() {
        // TODO: remove this mock
        const promise = $.Deferred();

        this._data = _.range(5).map((i) => {
            return {
                uri: "Heat Meter #" + (6500 + i),
                id: this._counter++,
                sensors: [],
                actuators: []
            };
        });
        promise.resolve(this._data);

        return promise;
    }
    loadDetail(uri) {
        console.log('loading additional info about class with URI = ', uri);
        const promise = $.Deferred();

        let response =  JSONLDtoClass({
          "@context": {
            "dul": "http://www.loa-cnr.it/ontologies/DUL.owl#",
            "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
            "geosparql": "http://www.opengis.net/ont/geosparql#",
            "hmtr": "http://purl.org/NET/ssnext/heatmeters#",
            "limap": "http://data.uni-muenster.de/php/vocab/limap",
            "limapext": "http://purl.org/NET/limapext#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
            "ssncom": "http://purl.org/NET/ssnext/communication#",
            "xsd": "http://www.w3.org/2001/XMLSchema#"
          },
          "@graph": [
            {
              "@id": uri,
              "@type": "ssn:System",
              "rdfs:label": uri,
              "ssn:hasSubsystem": [
                {
                  "@id": "coap://10.1.1.1:6500:6500/meter/temperature"
                }
              ]
            },
            {
              "@id": "coap://10.1.1.1:6500:6500/meter/temperature",
              "@type": "ssn:Sensor",
              "ssn:observes": {
                "@id": "hmtr:Temperature"
              }
            }
          ]
        });

        this._data.forEach((c, index) => {
            if (c.uri === uri) {
                this._data[index] = _.assign({}, this._data[index], response);
            }
        });
        promise.resolve(this._data);
        return promise;
        //
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
            data: JSON.stringify(classToJSONLD(model)),
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
            type: "hmtr:Temperature"
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
