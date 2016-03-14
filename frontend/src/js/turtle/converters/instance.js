import { parseTriples } from '../../utils';
import { getInstanceDevice, getInstanceObservation } from '../templates/instance';
import $ from 'jquery';
import { TurtlePrefixes } from '../../prefixes';
import Model from '../schemas';

function parseType(s) {
    try {
        return s.featureOfInterest.substring(s.featureOfInterest.indexOf("#") + 1);
    } catch(e) {
        console.warn('failed to parse observation type; fallback to default, but you should add SPARQL query for this');
        return "observation";
    }
}

function instanceToTurtle(instance) {
    return {
        device: TurtlePrefixes + getInstanceDevice(instance),
        observations: instance.model.sensors.map((s) => {
            return {
                type: parseType(s),
                text: TurtlePrefixes + getInstanceObservation(instance, s.uri)
            };
        })
    };
}

export default {
    instanceToTurtle
};