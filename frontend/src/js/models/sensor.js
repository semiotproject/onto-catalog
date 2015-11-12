import { Util } from 'n3';

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
        let oldLabel = this._store.find(this.uri, 'rdfs:label', null, '')[0];
        let newLabel = _.assign({}, oldLabel, {
            object: `"${str}"`
        });
        this._replaceTriple(oldLabel, newLabel);
    }

    get observes() {
        return Util.getLiteralValue(this._findObject(this.uri, 'ssn:observes', null, ''));
    }

    get measurementPreperties() {
        const mc = this._findObject(this.uri, 'ssn:hasMeasurementCapability', null, '');

        const props = this._store.find(mc, "ssn:hasMeasurementProperty", null, '');

        debugger;

        return props.map((triple) => {
            return triple.object;
        });
    }
    getMeasurementProperty(type) {
        let capability;

        this.measurementPreperties.map((mp) => {
            if (this._findObject(mp, "rdf:type", type)) {
                capability = Util.getLiteralValue(this._findObject(
                    this._findObject(this.uri, 'ssn:hasValue', null, ''),
                    "dul:hasDataValue",
                    null
                ));
            }
        });
        return capability;
    }
    get accuracy() {
        return this.getMeasurementProperty('ssn:Accuracy');
    }
    get sensitivity() {
        return this.getMeasurementProperty('ssn:Sensitivity');
    }
    get resolution() {
        return this.getMeasurementProperty('ssn:Resolution');
    }

    get unit() {
        // return Util.getLiteralValue(this._findObject(uri, 'ssn:observes', null, ''));
    }

}