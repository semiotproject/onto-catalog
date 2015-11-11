import { Store, Util, Parser, Writer } from 'n3';
import { JSONPrefixes } from '../prefixes';
import _ from 'lodash';

const parser = new Parser();
const store = new Store();
store.addPrefixes(JSONPrefixes);

const writer = new Writer({ prefixes: JSONPrefixes});

export default class Device {
    constructor(triples, callback) {
        triples.map((t) => {
            store.addTriple(t.subject, t.predicate, t.object, t.graph);
        });
        console.info(`device with ${triples.length} triples inited`);
    }

    find() {
        return store.find(...arguments);
    }
    addTriple() {
        return store.addTriple(...arguments);
    }
    removeTriple() {
        return store.removeTriple(...arguments);
    }

    _findObject(sub, pred, ob) {
        let object = store.find(sub, pred, ob, "");
        if (object.length === 0 || !object[0].object) {
            console.error(`error getting object`);
            return null;
        }
        return object[0].object;
    }
    _findSubject(sub, pred, ob) {
        let object = store.find(sub, pred, ob, "");
        if (object.length === 0 || !object[0].subject) {
            console.error(`error getting subject`);
            return null;
        }
        return object[0].subject;
    }
    _replaceTriple(oldTriple, newTriple) {
        store.removeTriple(oldTriple);
        store.addTriple(newTriple);
    }

    get uri() {
        return this._findSubject(null, 'rdfs:subClassOf', 'ssn:System', '');
    }

    get label() {
        return Util.getLiteralValue(this._findObject(this.uri, 'rdfs:label', null, ''));
    }
    set label(str) {
        let oldLabel = store.find(this.uri, 'rdfs:label', null, '')[0];
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

    toTurtle(callback) {
        store.find(null, null, null, "").map((t) => {
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