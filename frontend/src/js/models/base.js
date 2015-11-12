import { Store, Writer } from 'n3';
import { JSONPrefixes } from '../prefixes';

export default class Base {
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

    toTurtle(callback) {
        const writer = new Writer({ prefixes: JSONPrefixes});

        this._store.find(null, null, null, "").map((t) => {
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