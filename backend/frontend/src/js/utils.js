import { Parser } from 'n3';
import $ from 'jquery';
import CONFIG from './config';

export function parseTriples(turtle) {

    const parser = new Parser();
    const defer = $.Deferred();
    const triples = [];

    parser.parse(turtle, (err, triple) => {
        if (err) {
            console.error(`error while parsing triples: `, err);
            defer.reject();
        }
        if (triple) {
            triples.push(triple);
        } else {
            defer.resolve(triples);
        }
    });

    return defer;
}
export function parseUUIDFromURI(uri) {
    return uri.substring(CONFIG.SEMDESC_PREFIX.length);
}
export function constructURIFromUUID(uuid) {
    return CONFIG.SEMDESC_PREFIX + uuid;
}