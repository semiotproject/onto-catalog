"use strict";

import { EventEmitter } from 'events';
import _ from 'lodash';
import $ from 'jquery';

import PrefixesTemplate from './templates/prefixes.ttl';
import SystemTemplate from './templates/system.ttl';
import IndoorTemplate from './templates/indoor-location.ttl';
import OutdoorTemplate from './templates/outdoor-location.ttl';
import SensorTemplate from './templates/sensor.ttl';

import RdfTranslator from '../rdf-translator-adapter';

class DescriptionStore extends EventEmitter {
    constructor() {
        super();
        this._data = {
            description: {
                manufacture: {},
                deployment: {},
                driver: {}
            },
            meters: [],
            actuators: []
        };
    }

    getManufacture() {
        return this._data.description.manufacture;
    }
    setManufacture(data) {
        this._data.description.manufacture = data;
    }

    getDeployment() {
        return this._data.description.deployment;
    }
    setDeployment(data) {
        this._data.description.deployment = data;
    }

    getDriver() {
        return this._data.description.driver;
    }
    setDriver(data) {
        this._data.description.driver = data;
    }

    getActuators() {
        return this._data.actuators;
    }
    getActuatorById(aid) {
        return _.find(this._data.actuators, (a) => {
            return a.id === aid;
        })
    }

    getMeters() {
        return this._data.meters;
    }
    getMeterById(aid) {
        return _.find(this._data.meter, (m) => {
            return m.id === mid;
        })
    }
    addMeter(meter) {
        meter.id = this._data.meters.length;
        this._data.meters.push(meter);
        this.emit('update');
    }
    saveMeter(meter) {
        this._data.meters.forEach((m, index) => {
            if (m.id == meter.id) {
                this._data.meters[index] = sensor;
                this.emit('update');
            }
        });
    }

    /**
     * We use Turtle (N3 subset) as a mediate format,
     * and RdfTranslator AP for convertation
     */
    generateJsonLd() {
        return RdfTranslator.turtleToJsonLd(this._generateTurtle());
    }
    generateN3() {
        const promise = $.Deferred();

        let turtle = this._generateTurtle();
        setTimeout(() => {
            promise.resolve(turtle);
        }, 1000);

        return promise;
    }
    generateRdfXml() {
        return RdfTranslator.turtleToRdfXml(this._generateTurtle());
    }

    _generateTurtle() {
        let result = PrefixesTemplate;

        let uri = this._data.description.manufacture.uri;

        // system description
        result += _.template(SystemTemplate)({
            uri: uri,
            label: this._data.description.manufacture.label,
            sensors: this._data.meters
        });

        // location description
        if (this._data.description.deployment.outdoor) {
            result += _.template(OutdoorTemplate)(this._data.description.deployment.outdoor);
        }
        if (this._data.description.deployment.indoor) {
            result += _.template(IndoorTemplate)(this._data.description.deployment.indoor);
        }

        result += ".";

        // sensor description
        this._data.meters.map((s) => {
            result += _.template(SensorTemplate)({
                uri: uri,
                observes: "ssn:" + s.type, // FIXME
                endpoint: s.endpoint,
                protocol: s.protocol
            });
        });

        return result;
    }
}

export default new DescriptionStore();
