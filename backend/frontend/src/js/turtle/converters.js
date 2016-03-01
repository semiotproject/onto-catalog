import { parseTriples } from '../utils';
import { getModel, getSensor, getMeasurementProperty } from './templates';
import $ from 'jquery';
import { TurtlePrefixes } from '../prefixes';
import Model from './schemas';

function fromTurtle(ttl) {
    const promise =  $.Deferred();

    parseTriples(ttl).then((triples) => {

        const model = new Model(triples);

        const normalisedModel = {
            uri: model.uri,
            label: model.label,
            manufacturer: model.manufacturer,
            sensors: model.sensors.map((sensorURI) => {
                return {
                    uri: sensorURI,
                    label: model.getSensorLabel(sensorURI),
                    featureOfInterest: model.getSensorFeatureOfInterest(sensorURI),
                    unitsOfMeasurement: model.getSensorUnitsOfMeasurement(sensorURI),
                    props: model.getSensorMeasurementPreperties(sensorURI).map((propURI) => {
                        return {
                            uri: propURI,
                            type: model.getSensorMeasurementPropertyType(propURI),
                            value:  model.getSensorMeasurementPropertyValue(propURI)
                        };
                    })
                };
            })
        };

        console.info(`normalized model is: `, normalisedModel);

        promise.resolve(normalisedModel);
    });

    return promise;
}

function toTurtle(model) {
    let str = TurtlePrefixes;

    str += getModel(model);

    model.sensors.map((s) => {
        str += getSensor(model.uri, s);
        s.props.map((p) => {
            str += getMeasurementProperty(s.uri, p);
        });
    });

    console.log('raw ttl is: ', str);

    return str;
}

export default {
    fromTurtle,
    toTurtle
};