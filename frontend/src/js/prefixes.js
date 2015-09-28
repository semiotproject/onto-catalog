"use strict";

const PREFIXES = {
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
    "hmtr": "http://purl.org/NET/ssnext/heatmeters#",
    "ssncom": "http://purl.org/NET/ssnext/communication#",
    "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "geosparql": "http://www.opengis.net/ont/geosparql#",
    "dul": "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "limapext": "http://purl.org/NET/limapext#",
    "limap": "http://data.uni-muenster.de/php/vocab/limap",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
};

export const JSONPrefixes = PREFIXES;

export const SPARQLPrefixes = (function() {
    let str = [];
    for (let key in PREFIXES) {
        str.push(`PREFIX ${key}: <${PREFIXES[key]}>`);
    }
    console.log(str.join('\n') + '\n');
    return str.join('\n') + '\n';
})();
