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
    get manufacturer() {
        return Util.getLiteralValue(this._findObject(
            this._findObject(this.uri, 'mmi:hasManufacturer', null, ''),
            "rdfs:label",
            null
        ));
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

    getSensorFeatureOfInterest(uri) {
        const obs = this._findObject(uri, 'ssn:observes', null, '');
        return obs;
    }

    getSensorMeasurementPreperties(uri) {
        const mc = this._findObject(uri, 'ssn:hasMeasurementCapability', null, '');
        const props = this.find(mc, "ssn:hasMeasurementProperty", null, '');

        return props.map((triple) => {
            return triple.object;
        });
    }
    getSensorMeasurementPropertyType(propURI) {
        return this._findObject(
            propURI,
            "rdf:type",
            null
        );
    }
    getSensorMeasurementPropertyValue(propURI) {
        try {
            return Util.getLiteralValue(this._findObject(
                this._findObject(propURI, 'ssn:hasValue', null, ''),
                "ssn:hasValue",
                null
            ));
        } catch(e) {
            console.info('error while parsing property value; ');
            return null;
        }
    }
    getSensorMeasurementPropertyValueByType(uri, type) {
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
        return Util.getLiteralValue(this.getSensorMeasurementPropertyValueByType(uri, type));
    }
    getSensorUnitsOfMeasurement(uri) {
        return this.getSensorMeasurementPropertyValueByType(uri, 'qudt:Unit');
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
}

export default Model;