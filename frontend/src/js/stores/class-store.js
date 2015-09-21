"use strict";

import { EventEmitter } from 'events';
import CONFIG from '../config';
import $ from 'jquery';
import _ from 'lodash';
import uuid from 'uuid';
import { classToJSONLD, JSONLDtoClass } from '../json-ld-adapter';
import { loadClassList, loadClassDetail } from '../sparql-adapter';
import CurrentUserStore from './current-user-store';

class ClassStore extends EventEmitter {
    constructor() {
        super();
        this._counter = 0;
    }
    loadList() {
        // TODO: remove this mock
        return loadClassList().done((res) => {
            this._classList = res;
        });
    }
    loadDetail(uri) {
        console.log('loading additional info about class with URI = ', uri);
        const promise = $.Deferred();

        let response =  JSONLDtoClass({
          "@context": {
            "DUL": "http://dul.org/#",
            "foaf": "http://foaf.org/#",
            "prov": "http://www.w3.org/ns/prov#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "semdesc": "http://semdesc.semiot.ru/classes/",
            "someprefix": "http://someprefix.org/#",
            "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "xsd1": "http://xsd.org/#"
          },
          "@graph": [
            {
              "@id": "_:ub32bL20C40",
              "@type": "ssn:Accuracy",
              "ssn:hasValue": {
                "@id": "_:ub32bL22C30"
              }
            },
            {
              "@id": "_:ub32bL55C43",
              "xsd1:double": "0.1"
            },
            {
              "@id": "_:ub32bL40C38",
              "@type": "ssn:MeasurementCapability",
              "ssn:forProperty": {
                "@id": "someprefix:AirHumidity"
              },
              "ssn:hasMeasurementProperty": [
                {
                  "@id": "_:ub32bL43C40"
                },
                {
                  "@id": "_:ub32bL51C40"
                }
              ]
            },
            {
              "@id": "http://github.com/soylent-grin",
              "@type": [
                "prov:Person",
                "prov:Agent"
              ],
              "foaf:givenName": {
                "@type": "xsd1:string",
                "@value": "Nikolay Klimov"
              },
              "foaf:mbox": {
                "@id": "mailto:.."
              }
            },
            {
              "@id": "_:ub32bL28C40",
              "@type": "ssn:Sensitivity",
              "ssn:hasValue": {
                "@id": "_:ub32bL30C30"
              }
            },
            {
              "@id": "_:ub32bL47C41",
              "xsd1:double": "2"
            },
            {
              "@id": "_:ub32bL37C8",
              "@type": "ssn:Sensor",
              "ssn:hasMeasurementCapability": {
                "@id": "_:ub32bL40C38"
              },
              "ssn:observes": {
                "@id": "someprefix:AirHumidity"
              }
            },
            {
              "@id": "_:ub32bL32C43",
              "xsd1:double": "0.1"
            },
            {
              "@id": "_:ub32bL17C38",
              "@type": "ssn:MeasurementCapability",
              "ssn:forProperty": {
                "@id": "someprefix:AirTemperature"
              },
              "ssn:hasMeasurementProperty": [
                {
                  "@id": "_:ub32bL28C40"
                },
                {
                  "@id": "_:ub32bL20C40"
                }
              ]
            },
            {
              "@id": "_:ub32bL51C40",
              "@type": "ssn:Sensitivity",
              "ssn:hasValue": {
                "@id": "_:ub32bL53C30"
              }
            },
            {
              "@id": "_:ub32bL24C43",
              "xsd1:double": "0.5"
            },
            {
              "@id": "_:ub32bL30C30",
              "@type": "DUL:Amount",
              "DUL:hasDataValue": {
                "@id": "_:ub32bL32C43"
              },
              "DUL:isClassifiedBy": {
                "@id": "someprefix:Celsius"
              }
            },
            {
              "@id": "_:ub32bL43C40",
              "@type": "ssn:Accuracy",
              "ssn:hasValue": {
                "@id": "_:ub32bL45C30"
              }
            },
            {
              "@id": "_:ub32bL22C30",
              "@type": "DUL:Amount",
              "DUL:hasDataValue": {
                "@id": "_:ub32bL24C43"
              },
              "DUL:isClassifiedBy": {
                "@id": "someprefix:Celsius"
              }
            },
            {
              "@id": "_:ub32bL53C30",
              "@type": "DUL:Amount",
              "DUL:hasDataValue": {
                "@id": "_:ub32bL55C43"
              },
              "DUL:isClassifiedBy": {
                "@id": "someprefix:RH"
              }
            },
            {
              "@id": "_:ub32bL14C22",
              "@type": "ssn:Sensor",
              "ssn:hasMeasurementCapability": {
                "@id": "_:ub32bL17C38"
              },
              "ssn:observes": {
                "@id": "someprefix:AirTemperature"
              }
            },
            {
              "@id": "http://example.com/1",
              "@type": "prov:Entity",
              "prov:wasAttributedTo": {
                "@id": "http://github.com/soylent-grin"
              },
              "rdfs:label": {
                "@language": "en",
                "@value": "Air temperature and Humidity Sensor (DHT-22)"
              },
              "rdfs:subClassOf": {
                "@id": "ssn:System"
              },
              "ssn:hasSubSystem": [
                {
                  "@id": "_:ub32bL14C22"
                },
                {
                  "@id": "_:ub32bL37C8"
                }
              ]
            },
            {
              "@id": "_:ub32bL45C30",
              "@type": "DUL:Amount",
              "DUL:hasDataValue": {
                "@id": "_:ub32bL47C41"
              },
              "DUL:isClassifiedBy": {
                "@id": "someprefix:RH"
              }
            }
          ]
        });

        this._currentClass = response;
        promise.resolve(response);

        return promise;
        //
    }
    generate() {
        _.remove(this._classList, (c) => {
            return c.isNew;
        });
        let newClass = {
            uri: uuid.v4(),
            id: this._counter++,
            sensors: [],
            actuators: [],
            isNew: true
        };
        this._classList.push(newClass);
        this.emit('update');
        return newClass.id;
    }
    getById(id) {
        return _.find(this._classList, (c) => {
            return c.id === id;
        });
    }
    getByURI(uri) {
        return _.find(this._classList, (c) => {
            return c.uri;
        });
    }
    getCurrentClass() {
        return this._currentClass;
    }
    get() {
        return this._classList;
    }
    create(json) {
        //
    }
    // local
    update(json) {
        this._classList.forEach((c, index) => {
            if (c.id === json.id) {
                this._classList[index] = json;
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
                _.remove((this._classList, (m) => {
                    return m.id === classId;
                }));
                this.emit('update');
            },
            error() {

            }
        });
    }

    isEditable(classURI) {
        let user = CurrentUserStore.getCurrentUser();
        return true;
        // return (user && user.username === ClassStore.getByURI(classURI).author.username);
    }

    addSensor(classId) {
        let model = _.find(this._classList, (c) => {
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
        let model = _.find(this._classList, (c) => {
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
        let model = _.find(this._classList, (c) => {
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
