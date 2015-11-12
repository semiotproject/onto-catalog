import { Parser } from 'n3';
import $ from 'jquery';

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
