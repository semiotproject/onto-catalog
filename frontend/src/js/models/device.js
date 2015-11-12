import { Util, Writer } from 'n3';
import { parseTriples } from '../utils';
import $ from 'jquery';
import _ from 'lodash';
import { JSONPrefixes } from '../prefixes';

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
            const sensor = new Sensor(triples);
            this._sensors.push(sensor);

            // adding additional triple to device
            this._store.addTriple(this.uri, "ssn:hasSubSystem", sensor.uri);

            promise.resolve(sensor.uri);
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

    toTurtle(callback) {
        const writer = new Writer({ prefixes: JSONPrefixes});

        this.find(null, null, null, "").map((t) => {
            writer.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        this._sensors.map((s) => {
            s.find(null, null, null, "").map((t) => {
                writer.addTriple(t.subject, t.predicate, t.object, t.graph);
            });
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