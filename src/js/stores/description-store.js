"use strict";

import { EventEmitter } from 'events';
import _ from 'lodash';

import PrefixesTemplate from './templates/prefixes.ttl';
import MeterTemplate from './templates/meter.ttl';
import IndoorTemplate from './templates/indoor-location.ttl';
import OutdoorTemplate from './templates/outdoor-location.ttl';
import SensorTemplate from './templates/sensor.ttl';

class DescriptionStore extends EventEmitter {
    constructor() {
        super();
        this._data = {};
    }
    load() {
        this.emit('load');
    }
    save() {
        
    }
    remove() {
        
    }

    // actuators

    // meters
    getMeter() {
        return this._data.meter;
    }
    initMeter() {
        this._data.meter = {
            sensors: [],
            description: {
                manufacture: {},
                deployment: {
                    outdoor: {},
                    indoor: {}
                },
                drivers: {}
            }
        };
        console.info('meter inited');
    }
    updateMeter(meter) {
        this._data.meter = meter;
    }

    // sensors
    addSensor(sensor) {
        sensor.id = this._data.meter.sensors.length;
        this._data.meter.sensors.push(sensor);        
        console.info('sensor added');
    }
    saveSensor(sensor) {        
        this._data.meter.sensors.forEach((s, index) => {
            if (s.id == sensor.id) {
                this._data.meter.sensors[index] = sensor;
            }
        });        
        console.info('sensor updated');
    }
    getSensors() {
        return this._data.meter && this._data.meter.sensors;
    }
    getSensorById(id) {
        return this._data.meter &&
            _.find(this._data.meter.sensors, (s) => {
                return s.id == id;
            });
    }

    generate() {
        if (this._data.meter) {
            return this.generateMeter();
        } else {
            console.log('not implemented for non-meters devices');
        }
    }
    generateMeter() {
        let result = "";

        let uri = this._data.meter.description.manufacture.uri;

        result += PrefixesTemplate;

        this._data.meter.uri = uri;
        this._data.meter.label = this._data.meter.description.manufacture.label;
        this._data.meter.type = "ssn : Sensor";
        result += _.template(MeterTemplate)(this._data.meter);

        if (this._data.meter.description.deployment.outdoor) {
            result += _.template(OutdoorTemplate)(this._data.meter.description.deployment.outdoor);
        }
        if (this._data.meter.description.deployment.indoor) {
            result += _.template(IndoorTemplate)(this._data.meter.description.deployment.indoor);
        }
        this._data.meter.sensors.map((s) => {
            result += _.template(SensorTemplate)({
                uri: uri,
                observes: "mtr:" + s.type, // FIXME
                endpoint: s.endpoint,
                protocol: s.protocol
            });
        });

        return result;
    }
}

export default new DescriptionStore();
