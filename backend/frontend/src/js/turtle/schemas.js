import { parseTriples } from '../utils';
import { Store, Writer, Util } from 'n3';
import { JSONPrefixes } from '../prefixes';
import { getModel, getSensor, getMeasurementProperty } from './templates';
import $ from 'jquery';
import _ from 'lodash';

class Base {
    constructor() {
        this._store = new Store();
        this._store.addPrefixes(JSONPrefixes);
    }

    find() {
        return this._store.find(...arguments);
    }
    addTriple() {
        return this._store.addTriple(...arguments);
    }
    removeTriple() {
        return this._store.removeTriple(...arguments);
    }

    _findObject(sub, pred, ob) {
        let object = this._store.find(sub, pred, ob, "");
        if (object.length === 0 || !object[0].object) {
            return null;
        }
        return object[0].object;
    }
    _findSubject(sub, pred, ob) {
        let object = this._store.find(sub, pred, ob, "");
        if (object.length === 0 || !object[0].subject) {
            console.error(`error getting subject`);
            return null;
        }
        return object[0].subject;
    }
    _replaceTriple(oldTriple, newTriple) {
        this._store.removeTriple(oldTriple);
        this._store.addTriple(newTriple);
    }

    // remove all triples, where ${uri} is a subject, and related object
    cascadeRemove(uri) {
        console.info(`removing all information about triple, related to uri = ${uri}`);

        // cascade remove all triples, coming from $uri
        this._store.find(uri, null, null, "").map((t) => {
            this._store.removeTriple(t);
            this.cascadeRemove(t.object);
        });

        // non-cascade remove all triples, containes $uri as an object
        this._store.find(null, null, uri, "").map((t) => {
            this._store.removeTriple(t);
        });
    }

    toTurtle(callback) {
        const writer = new Writer({ prefixes: JSONPrefixes});

        this._store.find(null, null, null, "").map((t) => {
            writer.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        writer.end((err, result) => {
            if (err) {
                console.error(`error while writing model to Turtle: `, err);
                return;
            }
            callback(result);
        });
    }
}

class Model extends Base {
    constructor(triples, callback) {
        super();
        triples.map((t) => {
            this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        console.info(`model with ${triples.length} triples inited`);
    }

    /*
    *
    * Device mappings
    *
     */
    get uri() {
        return this._findSubject(null, 'rdfs:subClassOf', 'ssn:System', '');
    }

    get label() {
        return Util.getLiteralValue(this._findObject(this.uri, 'rdfs:label', null, ''));
    }
    set label(str) {
        let oldLabel = this.find(this.uri, 'rdfs:label', null, '')[0];
        let newLabel = _.assign({}, oldLabel, {
            object: `"${str}"`
        });
        this._replaceTriple(oldLabel, newLabel);
        console.log(`new label: ${this.label}`);
    }

    get manufacturer() {
        return Util.getLiteralValue(this._findObject(
            this._findObject(this.uri, 'mmi:hasManufacturer', null, ''),
            "rdfs:label",
            null
        ));
    }
    set manufacturer(str) {
        let oldManufacturer = this.find(
            this._findObject(this.uri, 'mmi:hasManufacturer', null, ''),
            "rdfs:label",
            null
        )[0];
        let newManufacturer = _.assign({}, oldManufacturer, {
            object: `"${str}"`
        });
        this._replaceTriple(oldManufacturer, newManufacturer);
        console.log(`new manufacturer: ${this.manufacturer}`);
    }

    get creator() {
        return {
            name: Util.getLiteralValue(this._findObject(
                this._findObject(this.uri, "prov:wasAttributedTo", null),
                "foaf:givenName",
                null
            )),
            email: this._findObject(
                this._findObject(this.uri, "prov:wasAttributedTo", null),
                "foaf:mbox",
                null
            )
        };
    }

    addSensor(turtle) {
        const promise = $.Deferred();

        parseTriples(turtle).then((triples) => {
            triples.map((t) => {
                this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
            });
            console.log(`added sensor with ${triples.length} triples`);
            promise.resolve();
        });

        return promise;
    }


    /*
    *
    * Sensors mappings
    *
     */
    get sensors() {
        return this.find(this.uri, "ssn:hasSubSystem", null, null).map((r) => {
            return r.object;
        });
    }

    getSensorLabel(uri) {
        return Util.getLiteralValue(this._findObject(uri, 'rdfs:label', null, ''));
    }
    setSensorLabel(uri, str) {
        let oldLabel = this.find(uri, 'rdfs:label', null, '')[0];
        let newLabel = _.assign({}, oldLabel, {
            object: `"${str}"`
        });
        this._replaceTriple(oldLabel, newLabel);
    }

    getSensorFeatureOfInterest(uri) {
        const obs = this._findObject(uri, 'ssn:observes', null, '');
        return obs;
    }
    setSensorObserves(uri, str) {
        const oldObs = this.find(uri, 'ssn:observes', null, '')[0];
        const newObs = _.assign({}, oldObs, {
            object: str
        });
        this._replaceTriple(oldObs, newObs);
    }

    getSensorMeasurementPreperties(uri) {
        const mc = this._findObject(uri, 'ssn:hasMeasurementCapability', null, '');
        const props = this.find(mc, "ssn:hasMeasurementProperty", null, '');

        return props.map((triple) => {
            return triple.object;
        });
    }
    getSensorMeasurementProperty(uri, type) {
        let prop;

        this.getSensorMeasurementPreperties(uri).map((mp) => {
            if (this._findObject(mp, "rdf:type", type)) {
                prop = this.find(
                    this._findObject(mp, 'ssn:hasValue', null, ''),
                    "ssn:hasValue",
                    null
                )[0];
            }
        });

        return prop;
    }
    setSensorMeasurementProperty(uri, type, value) {
        let oldProp = this.getSensorMeasurementProperty(uri, type);
        let newProp = _.assign({}, oldProp, {
            object: value
        });
        console.log(`setting ${uri} prop ${type} to ${value}`);
        this._replaceTriple(oldProp, newProp);
    }
    setSensorMeasurementPropertyLiteral(uri, type, value) {
        let oldProp = this.getSensorMeasurementProperty(uri, type);
        let newProp = _.assign({}, oldProp, {
            object: Util.createLiteral(value, Util.getLiteralType(oldProp.object))
        });
        console.log(`setting ${uri} prop ${type} to ${value}`);
        this._replaceTriple(oldProp, newProp);
    }
    getSensorMeasurementPropertyValue(uri, type) {
        let prop;

        this.getSensorMeasurementPreperties(uri).map((mp) => {
            if (this._findObject(mp, "rdf:type", type)) {
                prop = this._findObject(
                    this._findObject(mp, 'ssn:hasValue', null, ''),
                    "ssn:hasValue",
                    null
                );
            }
        });

        return prop;
    }
    getSensorMeasurementPropertyValueLiteral(uri, type) {
        return Util.getLiteralValue(this.getSensorMeasurementPropertyValue(uri, type));
    }

    getSensorAccuracy(uri) {
        return this.getSensorMeasurementPropertyValueLiteral(uri, 'ssn:Accuracy');
    }
    setSensorAccuracy(uri, str) {
        this.setSensorMeasurementPropertyLiteral(uri, 'ssn:Accuracy', str);
    }

    getSensorSensitivity(uri) {
        return this.getSensorMeasurementPropertyValueLiteral(uri, 'ssn:Sensitivity');
    }
    setSensorSensitivity(uri, str) {
        this.setSensorMeasurementPropertyLiteral(uri, 'ssn:Sensitivity', str);
    }

    getSensorResolution(uri) {
        return this.getSensorMeasurementPropertyValueLiteral(uri, 'ssn:Resolution');
    }
    setSensorResolution(uri, str) {
        this.setSensorMeasurementPropertyLiteral(uri, 'ssn:Resolution', str);
    }

    getSensorunitsOfMeasurement(uri) {
        return this.getSensorMeasurementPropertyValue(uri, 'qudt:Unit');
    }
    setSensorUnit(uri, str) {
        this.setSensorMeasurementProperty(uri, 'qudt:Unit', str);
    }

    /*
    *
    * Measuremet properties mappings
    *
     */
    addSensorProperty(turtle) {
        const promise = $.Deferred();

        parseTriples(turtle).then((triples) => {
            triples.map((t) => {
                this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
            });
            console.info(`added sensor measurement property with ${triples.length} triples`);
            promise.resolve();
        });

        return promise;
    }


    toTurtle(callback) {
        const writer = new Writer({ prefixes: JSONPrefixes});

        this.find(null, null, null, "").map((t) => {
            writer.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        writer.end((err, result) => {
            if (err) {
                console.error(`error while writing model to Turtle: `, err);
                return;
            }
            callback(result);
        });
    }

}

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
                    unitsOfMeasurement: model.getSensorunitsOfMeasurement(sensorURI),
                    props: model.getSensorMeasurementPreperties(sensorURI).map((propURI) => {
                        return {
                            uri: propURI,
                            type: 'TODO',
                            value: 'TODO'
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

export default Model;