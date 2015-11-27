import { Util, Writer } from 'n3';
import { parseTriples } from '../utils';
import $ from 'jquery';
import _ from 'lodash';
import { JSONPrefixes } from '../prefixes';

import Base from './base';

export default class Device extends Base {
    constructor(triples, callback) {
        super();
        triples.map((t) => {
            this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        console.info(`device with ${triples.length} triples inited`);
    }

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

    getSensorObserves(uri) {
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

    getSensorUnit(uri) {
        return this.getSensorMeasurementPropertyValue(uri, 'qudt:Unit');
    }
    setSensorUnit(uri, str) {
        this.setSensorMeasurementProperty(uri, 'qudt:Unit', str);
    }


    toTurtle(callback) {
        const writer = new Writer({ prefixes: JSONPrefixes});

        this.find(null, null, null, "").map((t) => {
            writer.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        writer.end((err, result) => {
            if (err) {
                console.error(`error while writing device to Turtle: `, err);
                return;
            }
            callback(result);
        });
    }

}