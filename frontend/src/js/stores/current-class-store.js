"use strict";

import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { classToJSONLD, JSONLDtoClass } from '../json-ld-adapter';
import { loadClassDetail } from '../sparql-adapter';
import * as TEMPLATES from '../templates';
import $ from 'jquery';
import _ from 'lodash';
import uuid from 'uuid';

class CurrentClassStore extends EventEmitter {
    constructor() {
        super();
        this._data = null;
    }
    load(classURI) {
        this._isNew = false;
        console.log('loading additional info about class with URI = ', classURI);
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

        this._data = response;

        promise.resolve(response);

        return promise;
        //
    }

    get() {
        return this._data;
    }
    isNew() {
        return this._isNew;
    }

    create() {
        this._isNew = true;
        this._data = TEMPLATES.ClassTemplate();
        return this._data.uri;
    }

    // local
    update(model) {
        console.log('now model is ', model);
        this._data = model;
        this.emit('update');
    }
    // remote
    save() {
        let model = this._data;
        let data = JSON.stringify(classToJSONLD(model));
        console.log('saving to triplestore model: ', data);
        return $.ajax({
            url: CONFIG.URLS.class + (this._isNew ? "" : encodeURIComponent(model.uri)),
            type: this._isNew ? "POST" : "PUT",
            data: data,
            contentType: "applcation/ls+json",
            success() {
                //
            },
            error() {

            }
        });
    }
    remove() {
        let model = this._data;
        return $.ajax({
            url: CONFIG.URLS.class + (this._isNew ? "" : encodeURIComponent(model.uri)),
            type: "DELETE",
            success: () => {
                //
            },
            error() {

            }
        });
    }

    isEditable() {
        let user = CurrentUserStore.getCurrentUser();
        return true;
        // return (user && user.username === ClassStore.getByURI(classURI).author.username);
    }

    addSensor() {
        let newSensor = TEMPLATES.SensorTemplate();
        this._data['ssn:hasSubSystem'].push(newSensor);

        this.emit('update');

        return newSensor.uri;
    }
    updateSensor(sensor) {
      _.forEach(this._data['ssn:hasSubSystem'], (s, index) => {
          if (s.uri === sensor.uri) {
            console.log('updating sensor: now is: ', sensor);
            this._data['ssn:hasSubSystem'][index] = sensor;
            this.emit('update');
          }
      });
    }
    getSensorByURI(sensorURI) {
        return _.find(this._data['ssn:hasSubSystem'], (s) => {
            return s.uri === sensorURI;
        });
    }
}

export default new CurrentClassStore();
