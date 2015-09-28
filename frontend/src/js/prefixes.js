"use strict";

const PREFIXES = {
    "qudt" : "http://qudt.org/schema/qudt#",
    "owl" : "http://www.w3.org/2002/07/owl#",
    "xsd" : "http://www.w3.org/2001/XMLSchema#",
    "skos" : "http://www.w3.org/2004/02/skos/core#",
    "rdfs" : "http://www.w3.org/2000/01/rdf-schema#",
    "ssn" : "http://purl.oclc.org/NET/ssnx/ssn#",
    "geo" : "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "dct" : "http://purl.org/dc/terms/",
    "semdesc" : "http://semdesc.semiot.ru/users/",
    "DUL" : "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "vann" : "http://purl.org/vocab/vann/",
    "prov" : "http://www.w3.org/ns/prov#",
    "foaf" : "http://xmlns.com/foaf/0.1/",
    "cc" : "http://creativecommons.org/ns#",
    "qudt-1.1" : "http://qudt.org/1.1/schema/qudt#",
    "vaem" : "http://www.linkedmodel.org/schema/vaem#",
    "voag" : "http://voag.linkedmodel.org/schema/voag#",
    "dtype" : "http://www.linkedmodel.org/schema/dtype#",
    "geosparql" : "http://www.opengis.net/ont/geosparql#",
    "hmtr" : "http://purl.org/NET/ssnext/heatmeters#",
    "rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "ssncom" : "http://purl.org/NET/ssnext/communication#",
    "limapext" : "http://purl.org/NET/limapext#",
    "dul" : "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "creativecommons" : "http://creativecommons.org/ns#",
    "dc" : "http://purl.org/dc/elements/1.1/"
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
