import { Util } from 'n3';
import { parseTriples } from '../utils';
import $ from 'jquery';

import Sensor from './sensor';
import Base from './base';

export default class Device extends Base {
    constructor(triples, callback) {
        super();
        triples.map((t) => {
            this._store.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        this._sensors = [];
        console.info(`device with ${triples.length} triples inited`);
    }

    get uri() {
        return this._findSubject(null, 'rdfs:subClassOf', 'ssn:System', '');
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

    addSensor(turtle) {
        const promise = $.Deferred();

        parseTriples(turtle).then((triples) => {
            this._sensors.push(new Sensor(triples));
            promise.resolve();
        });

        return promise;
    }

    get sensors() {
        return this._sensors;
    }
    getSensor(uri) {
        return _.find(this._sensors, (s) => {
            return s.uri === uri;
        });
    }

}