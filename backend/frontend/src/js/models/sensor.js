import { Util } from 'n3';
import _ from 'lodash';

import Base from './base';

export default class Sensor extends Base {
    constructor(triples, callback) {
        super();
        triples.map((t) => {
            this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        console.info(`sensor with ${triples.length} triples inited`);
    }

    get uri() {
        return this._findSubject(null, 'rdf:type', 'ssn:SensingDevice', '');
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
    }

    get observes() {
        const obs = this._findObject(this.uri, 'ssn:observes', null, '');
        return obs;
    }
    set observes(str) {
        const oldObs = this.find(this.uri, 'ssn:observes', null, '')[0];
        const newObs = _.assign({}, oldObs, {
            object: str
        });
        this._replaceTriple(oldObs, newObs);
    }

    get measurementPreperties() {
        const mc = this._findObject(this.uri, 'ssn:hasMeasurementCapability', null, '');
        const props = this.find(mc, "ssn:hasMeasurementProperty", null, '');

        return props.map((triple) => {
            return triple.object;
        });
    }
    getMeasurementProperty(type) {
        let prop;

        this.measurementPreperties.map((mp) => {
            if (this._findObject(mp, "rdf:type", type)) {
                prop = this.find(
                    this._findObject(mp, 'ssn:hasValue', null, ''),
                    "dul:hasDataValue",
                    null
                )[0];
            }
        });

        return prop;
    }
    setMeasurementProperty(type, value) {
        let oldProp = this.getMeasurementProperty(type);
        let newProp = _.assign({}, oldProp, {
            object: Util.createLiteral(value, Util.getLiteralType(oldProp.object))
        });
        console.log(`setting prop ${type} to ${value}`);
        this._replaceTriple(oldProp, newProp);
    }
    getMeasurementPropertyValue(type) {
        let prop;

        this.measurementPreperties.map((mp) => {
            if (this._findObject(mp, "rdf:type", type)) {
                prop = Util.getLiteralValue(this._findObject(
                    this._findObject(mp, 'ssn:hasValue', null, ''),
                    "dul:hasDataValue",
                    null
                ));
            }
        });

        return prop;
    }

    get accuracy() {
        return this.getMeasurementPropertyValue('ssn:Accuracy');
    }
    set accuracy(str) {
        this.setMeasurementProperty('ssn:Accuracy', str);
    }

    get sensitivity() {
        return this.getMeasurementPropertyValue('ssn:Sensitivity');
    }
    set sensitivity(str) {
        this.setMeasurementProperty('ssn:Sensitivity', str);
    }

    get resolution() {
        return this.getMeasurementPropertyValue('ssn:Resolution');
    }
    set resolution(str) {
        this.setMeasurementProperty('ssn:Resolution', str);
    }

    get unit() {
        // return Util.getLiteralValue(this._findObject(uri, 'ssn:observes', null, ''));
    }

}